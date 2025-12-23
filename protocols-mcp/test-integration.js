/**
 * Integration test for the protocols MCP server components
 * This tests the core functionality without requiring MCP SDK runtime
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The protocols are in the parent directory (the workspace root)
const protocolsRoot = path.resolve(__dirname, '..');

/**
 * Build a content map from protocols by reading their files
 * @param {Array} protocols - Array of protocol metadata objects
 * @param {string} rootPath - Root path to protocols directory
 * @returns {Promise<Map>} Map of filename -> content
 */
async function buildContentMap(protocols, rootPath) {
  const fs = await import('fs');
  const contentMap = new Map();
  
  for (const protocol of protocols) {
    const filePath = path.join(rootPath, protocol.filePath, protocol.fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    contentMap.set(protocol.fileName, content);
  }
  
  return contentMap;
}

/**
 * Assert that a condition is true, throwing if not
 * @param {boolean} condition - Condition to check
 * @param {string} message - Error message if assertion fails
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log(`Running Integration Tests from: ${__dirname}`);
  console.log(`Protocols root: ${protocolsRoot}\n`);
  
  let passed = 0;
  let failed = 0;

  // Test 1a: ProtocolScanner - scanProtocols
  try {
    console.log('Test 1a: ProtocolScanner.scanProtocols()');
    const { ProtocolScanner } = await import('./build/scanner/protocol-scanner.js');
    const scanner = new ProtocolScanner(protocolsRoot);
    const protocols = await scanner.scanProtocols();
    
    assert(protocols.length > 0, 'Expected at least one protocol');
    assert(protocols.length === 17, `Expected 17 protocols, got ${protocols.length}`);
    
    console.log(`  ✓ Found ${protocols.length} protocols`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ProtocolScanner.scanProtocols error: ${error.message}`);
    failed++;
  }

  // Test 1b: ProtocolScanner - getProtocol
  try {
    console.log('Test 1b: ProtocolScanner.getProtocol()');
    const { ProtocolScanner } = await import('./build/scanner/protocol-scanner.js');
    const scanner = new ProtocolScanner(protocolsRoot);
    
    const debugProto = await scanner.getProtocol('debug_protocol');
    assert(debugProto !== null, 'Expected to find debug_protocol');
    assert(debugProto.name === 'debug_protocol', `Expected debug_protocol, got ${debugProto.name}`);
    
    console.log(`  ✓ getProtocol works: ${debugProto.name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ProtocolScanner.getProtocol error: ${error.message}`);
    failed++;
  }

  // Test 1c: ProtocolScanner - getProtocolByTrigger
  try {
    console.log('Test 1c: ProtocolScanner.getProtocolByTrigger()');
    const { ProtocolScanner } = await import('./build/scanner/protocol-scanner.js');
    const scanner = new ProtocolScanner(protocolsRoot);
    
    const masterProto = await scanner.getProtocolByTrigger('MASTER');
    assert(masterProto !== null, 'Expected to find protocol with MASTER trigger');
    assert(masterProto.name === 'MASTER_PROTOCOL', `Expected MASTER_PROTOCOL, got ${masterProto.name}`);
    
    console.log(`  ✓ getProtocolByTrigger works: ${masterProto.name}`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ProtocolScanner.getProtocolByTrigger error: ${error.message}`);
    failed++;
  }

  // Test 2: ContentIndexer
  try {
    console.log('\nTest 2: ContentIndexer');
    const { ContentIndexer } = await import('./build/search/indexer.js');
    const { ProtocolScanner } = await import('./build/scanner/protocol-scanner.js');
    
    const scanner = new ProtocolScanner(protocolsRoot);
    const protocols = await scanner.scanProtocols();
    const contentMap = await buildContentMap(protocols, protocolsRoot);
    const indexer = new ContentIndexer();
    
    indexer.buildIndex(protocols, contentMap);
    const index = indexer.getIndex();
    
    assert(index !== null, 'Expected index to be defined');
    assert(index.protocols.size > 0, 'Expected at least one protocol in index');
    assert(index.protocols.size === protocols.length, 
      `Expected ${protocols.length} protocols in index, got ${index.protocols.size}`);
    
    console.log(`  ✓ Index built with ${index.protocols.size} entries`);
    passed++;
  } catch (error) {
    console.log(`  ✗ ContentIndexer error: ${error.message}`);
    failed++;
  }

  // Test 3a: SearchMatcher - search
  try {
    console.log('\nTest 3a: SearchMatcher.search()');
    const { SearchMatcher } = await import('./build/search/matcher.js');
    const { ContentIndexer } = await import('./build/search/indexer.js');
    const { ProtocolScanner } = await import('./build/scanner/protocol-scanner.js');
    
    const scanner = new ProtocolScanner(protocolsRoot);
    const protocols = await scanner.scanProtocols();
    const contentMap = await buildContentMap(protocols, protocolsRoot);
    const indexer = new ContentIndexer();
    
    indexer.buildIndex(protocols, contentMap);
    const matcher = new SearchMatcher();
    
    const searchResults = matcher.search(indexer.getIndex(), 'debugging');
    assert(searchResults.length > 0, 'Expected at least one search result for "debugging"');
    assert(searchResults[0].protocol !== undefined, 'Expected protocol name in result');
    assert(typeof searchResults[0].score === 'number', 'Expected score in result');
    assert(searchResults[0].score > 0, 'Expected positive score for "debugging" search');
    
    console.log(`  ✓ Search for "debugging": ${searchResults.length} results (top: ${searchResults[0].protocol}, score: ${searchResults[0].score})`);
    passed++;
  } catch (error) {
    console.log(`  ✗ SearchMatcher.search error: ${error.message}`);
    failed++;
  }

  // Test 3b: SearchMatcher - fuzzyMatch
  try {
    console.log('\nTest 3b: SearchMatcher.fuzzyMatch()');
    const { SearchMatcher } = await import('./build/search/matcher.js');
    const { ContentIndexer } = await import('./build/search/indexer.js');
    const { ProtocolScanner } = await import('./build/scanner/protocol-scanner.js');
    
    const scanner = new ProtocolScanner(protocolsRoot);
    const protocols = await scanner.scanProtocols();
    const contentMap = await buildContentMap(protocols, protocolsRoot);
    const indexer = new ContentIndexer();
    
    indexer.buildIndex(protocols, contentMap);
    const matcher = new SearchMatcher();
    
    const fuzzyResults = matcher.fuzzyMatch(indexer.getIndex(), 'debug');
    assert(fuzzyResults.length > 0, 'Expected at least one fuzzy match for "debug"');
    assert(fuzzyResults[0].protocol !== undefined, 'Expected protocol name in result');
    assert(typeof fuzzyResults[0].similarity === 'number', 'Expected similarity in result');
    assert(fuzzyResults[0].similarity > 0.3, `Expected similarity > 0.3, got ${fuzzyResults[0].similarity}`);
    assert(fuzzyResults[0].protocol === 'debug_protocol', `Expected debug_protocol, got ${fuzzyResults[0].protocol}`);
    
    console.log(`  ✓ Fuzzy match "debug": ${fuzzyResults.length} results (top: ${fuzzyResults[0].protocol}, similarity: ${fuzzyResults[0].similarity.toFixed(2)})`);
    passed++;
  } catch (error) {
    console.log(`  ✗ SearchMatcher.fuzzyMatch error: ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);
