/**
 * Protocol Dependency Resolver
 * Handles prerequisite detection, circular dependency detection, and execution order determination
 */

import { ExtendedProtocolMetadata } from '../types/index.js';

export interface DependencyNode {
  protocol: string;
  dependencies: string[];
  dependents: string[];
  executionOrder: number;
}

export interface ExecutionGraph {
  nodes: Map<string, DependencyNode>;
  edges: Map<string, string[]>;
  topologicalSort: string[];
  hasCycles: boolean;
  cycles?: string[][];
}

export interface CircularDependency {
  cycle: string[];
  protocols: string[];
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  recommendedOrder?: string[];
}

export interface ValidationIssue {
  type: 'missing_prerequisite' | 'circular_dependency' | 'unknown_protocol';
  message: string;
  protocols: string[];
  severity: 'error' | 'warning';
}

export class DependencyResolver {
  private metadataMap: Map<string, ExtendedProtocolMetadata>;
  private dependencyGraph: Map<string, DependencyNode>;
  private initialized: boolean = false;

  constructor(protocolMetadata: ExtendedProtocolMetadata[]) {
    this.metadataMap = new Map();
    this.dependencyGraph = new Map();

    for (const meta of protocolMetadata) {
      this.metadataMap.set(meta.name, meta);
    }
  }

  private initializeGraph(): void {
    if (this.initialized) return;

    this.dependencyGraph.clear();

    for (const [name, meta] of this.metadataMap) {
      this.dependencyGraph.set(name, {
        protocol: name,
        dependencies: [...meta.prerequisites],
        dependents: [],
        executionOrder: 0
      });
    }

    for (const [name, node] of this.dependencyGraph) {
      for (const dep of node.dependencies) {
        const depNode = this.dependencyGraph.get(dep);
        if (depNode) {
          depNode.dependents.push(name);
        }
      }
    }

    this.initialized = true;
  }

  async resolvePrerequisites(protocol: string): Promise<string[]> {
    this.initializeGraph();

    const node = this.dependencyGraph.get(protocol);
    if (!node) {
      return [];
    }

    const prerequisites = new Set<string>();
    const queue: string[] = [protocol];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const currentNode = this.dependencyGraph.get(current);
      if (!currentNode) continue;

      for (const dep of currentNode.dependencies) {
        if (!prerequisites.has(dep)) {
          prerequisites.add(dep);
          queue.push(dep);
        }
      }
    }

    return Array.from(prerequisites);
  }

  async validateChain(protocols: string[]): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const allPrerequisites = new Set<string>();
    const knownProtocols = new Set(this.metadataMap.keys());

    for (const protocol of protocols) {
      if (!knownProtocols.has(protocol)) {
        issues.push({
          type: 'unknown_protocol',
          message: `Unknown protocol: ${protocol}`,
          protocols: [protocol],
          severity: 'error'
        });
        continue;
      }

      const prereqs = await this.resolvePrerequisites(protocol);
      for (const prereq of prereqs) {
        allPrerequisites.add(prereq);
      }
    }

    for (const prereq of allPrerequisites) {
      if (!protocols.includes(prereq) && !knownProtocols.has(prereq)) {
        issues.push({
          type: 'missing_prerequisite',
          message: `Missing prerequisite: ${prereq}`,
          protocols: [prereq],
          severity: 'error'
        });
      }
    }

    const executionOrder = await this.getExecutionOrder(protocols);
    const circularDeps = await this.detectCircularDependencies();

    const relevantCycles = circularDeps.filter(cycle =>
      cycle.protocols.some(p => protocols.includes(p))
    );

    if (relevantCycles.length > 0) {
      for (const cycle of relevantCycles) {
        issues.push({
          type: 'circular_dependency',
          message: `Circular dependency detected: ${cycle.cycle.join(' -> ')}`,
          protocols: cycle.protocols,
          severity: 'error'
        });
      }
    }

    return {
      valid: issues.length === 0,
      issues,
      recommendedOrder: executionOrder
    };
  }

  async detectCircularDependencies(): Promise<CircularDependency[]> {
    this.initializeGraph();

    const cycles: CircularDependency[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const path: string[] = [];

    const dfs = (node: string): void => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart);
        cycles.push({
          cycle: [...cycle, node],
          protocols: cycle,
          severity: cycle.length <= 2 ? 'error' : 'warning'
        });
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const graphNode = this.dependencyGraph.get(node);
      if (graphNode) {
        for (const dep of graphNode.dependencies) {
          dfs(dep);
        }
      }

      path.pop();
      recursionStack.delete(node);
    };

    for (const node of this.dependencyGraph.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return cycles;
  }

  async buildExecutionGraph(protocols: string[]): Promise<ExecutionGraph> {
    this.initializeGraph();

    const relevantNodes = new Map<string, DependencyNode>();
    const edges = new Map<string, string[]>();

    for (const protocol of protocols) {
      const node = this.dependencyGraph.get(protocol);
      if (node) {
        const filteredNode: DependencyNode = {
          protocol: node.protocol,
          dependencies: node.dependencies.filter(d => protocols.includes(d)),
          dependents: node.dependents.filter(d => protocols.includes(d)),
          executionOrder: 0
        };
        relevantNodes.set(protocol, filteredNode);
        edges.set(protocol, filteredNode.dependencies);
      }
    }

    const topologicalSort = await this.getExecutionOrder(protocols);
    const orderMap = new Map(topologicalSort.map((p, i) => [p, i]));

    for (const [name, node] of relevantNodes) {
      node.executionOrder = orderMap.get(name) ?? 0;
    }

    const allCycles = await this.detectCircularDependencies();
    const relevantCycles = allCycles.filter(cycle =>
      cycle.protocols.some(p => protocols.includes(p))
    );

    return {
      nodes: relevantNodes,
      edges,
      topologicalSort,
      hasCycles: relevantCycles.length > 0,
      cycles: relevantCycles.length > 0 ? relevantCycles.map(c => c.cycle) : undefined
    };
  }

  async getExecutionOrder(protocols: string[]): Promise<string[]> {
    this.initializeGraph();

    const relevantNodes = new Map<string, DependencyNode>();
    const inDegree = new Map<string, number>();
    const queue: string[] = [];

    for (const protocol of protocols) {
      const node = this.dependencyGraph.get(protocol);
      if (node) {
        const filteredNode: DependencyNode = {
          protocol: node.protocol,
          dependencies: node.dependencies.filter(d => protocols.includes(d)),
          dependents: node.dependents.filter(d => protocols.includes(d)),
          executionOrder: 0
        };
        relevantNodes.set(protocol, filteredNode);
      }
    }

    for (const [name, node] of relevantNodes) {
      const depsInScope = node.dependencies.filter(d => relevantNodes.has(d));
      inDegree.set(name, depsInScope.length);
    }

    for (const [name, degree] of inDegree) {
      if (degree === 0) {
        queue.push(name);
      }
    }

    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const currentNode = relevantNodes.get(current);
      if (currentNode) {
        for (const dependent of currentNode.dependents) {
          if (relevantNodes.has(dependent)) {
            const currentDegree = inDegree.get(dependent) ?? 0;
            inDegree.set(dependent, currentDegree - 1);
            if (currentDegree - 1 === 0) {
              queue.push(dependent);
            }
          }
        }
      }
    }

    if (result.length !== relevantNodes.size) {
      const remaining = Array.from(relevantNodes.keys()).filter(p => !result.includes(p));
      for (const node of remaining) {
        if (!result.includes(node)) {
          result.push(node);
        }
      }
    }

    const orderMap = new Map(result.map((p, i) => [p, i]));

    for (const [name, node] of relevantNodes) {
      node.executionOrder = orderMap.get(name) ?? 0;
    }

    return result;
  }

  async shouldRunBefore(protocolA: string, protocolB: string): Promise<boolean> {
    this.initializeGraph();

    const prereqsA = await this.resolvePrerequisites(protocolA);
    const prereqsB = await this.resolvePrerequisites(protocolB);

    if (prereqsA.includes(protocolB)) return true;
    if (prereqsB.includes(protocolA)) return false;

    const order = await this.getExecutionOrder([protocolA, protocolB]);
    return order.indexOf(protocolA) < order.indexOf(protocolB);
  }

  getProtocolMetadata(name: string): ExtendedProtocolMetadata | undefined {
    return this.metadataMap.get(name);
  }

  getAllProtocolNames(): string[] {
    return Array.from(this.metadataMap.keys());
  }

  async getDependencies(protocol: string): Promise<string[]> {
    this.initializeGraph();
    const node = this.dependencyGraph.get(protocol);
    return node?.dependencies ?? [];
  }

  async getDependents(protocol: string): Promise<string[]> {
    this.initializeGraph();
    const node = this.dependencyGraph.get(protocol);
    return node?.dependents ?? [];
  }
}
