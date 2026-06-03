// tests/bugfix-exploration.test.js

function runExplorationTests(window) {
  const document = window.document;
  const results = [];

  function assert(condition, message, counterexampleFn) {
    if (!condition) {
      const counterexample = counterexampleFn ? counterexampleFn() : "Assertion failed";
      results.push({ name: message, status: "FAIL", counterexample });
    } else {
      results.push({ name: message, status: "PASS" });
    }
  }

  // Test 1.A — Dual-Render
  try {
    window.switchTab('monitoring');
    const h2Count = document.querySelectorAll('#monitoring-container h2').length;
    const selectCount = document.querySelectorAll('#monitoring-container #monitoring-range-select').length;
    assert(
      h2Count === 1 && selectCount === 1,
      "Test 1.A — Dual-Render (Bug Condition 1.7 / 1.15)",
      () => `switchTab('monitoring') produces ${h2Count} h2 elements and ${selectCount} selects (expected 1 of each)`
    );
  } catch (e) {
    results.push({ name: "Test 1.A — Dual-Render (Bug Condition 1.7 / 1.15)", status: "ERROR", message: e.message });
  }

  // Test 1.B — Label Duplication
  try {
    const h1Text = document.querySelector('h1').textContent;
    assert(
      !/coNinja\s+coNinja/.test(h1Text),
      "Test 1.B — Label Duplication (Bug Condition 1.1)",
      () => `Found brand name duplication: "${h1Text}" (expected no duplication of "coNinja")`
    );
  } catch (e) {
    results.push({ name: "Test 1.B — Label Duplication (Bug Condition 1.1)", status: "ERROR", message: e.message });
  }

  // Test 1.C — Budget Duplication
  try {
    const budgetText = document.querySelector('.budget-spent').textContent;
    assert(
      !/\$[\d.]+\s+\$[\d.]+/.test(budgetText),
      "Test 1.C — Budget Duplication (Bug Condition 1.2)",
      () => `Found budget duplication: "${budgetText}"`
    );
  } catch (e) {
    results.push({ name: "Test 1.C — Budget Duplication (Bug Condition 1.2)", status: "ERROR", message: e.message });
  }

  // Test 1.D — Nav Topology
  try {
    window.switchTab('memory');
    const titleCount = document.querySelectorAll('.nav-section-title').length;
    const navItems = document.querySelectorAll('.nav-item');
    let allButtons = true;
    const nonButtonTags = [];
    navItems.forEach(item => {
      if (item.tagName !== 'BUTTON') {
        allButtons = false;
        nonButtonTags.push(`${item.textContent.trim()} (${item.tagName})`);
      }
    });

    assert(
      titleCount === 6 && allButtons,
      "Test 1.D — Nav Topology (Bug Condition 1.9–1.13)",
      () => `Nav section title count is ${titleCount} (expected 6). Non-button nav items found: [${nonButtonTags.join(', ')}]`
    );
  } catch (e) {
    results.push({ name: "Test 1.D — Nav Topology (Bug Condition 1.9–1.13)", status: "ERROR", message: e.message });
  }

  // Test 1.E — Memory Vault Empty
  try {
    window.switchTab('memory');
    const pinnedList = document.getElementById('memory-pinned-list');
    assert(
      pinnedList !== null,
      "Test 1.E — Memory Vault Empty (Bug Condition 1.14)",
      () => `memory-pinned-list element is null (Memory Vault container empty)`
    );
  } catch (e) {
    results.push({ name: "Test 1.E — Memory Vault Empty (Bug Condition 1.14)", status: "ERROR", message: e.message });
  }

  // Test 1.F — Debug ID Leak
  try {
    window.switchTab('security');
    const secText = document.getElementById('security-container').textContent;
    assert(
      !secText.includes('553c828c'),
      "Test 1.F — Debug ID Leak (Bug Condition 1.8)",
      () => `Found debug ID leak "553c828c" in security-container: "${secText.substring(0, 100)}..."`
    );
  } catch (e) {
    results.push({ name: "Test 1.F — Debug ID Leak (Bug Condition 1.8)", status: "ERROR", message: e.message });
  }

  // Test 1.G — Approvals Deadline Duplication
  try {
    window.switchTab('approvals');
    const deadlines = document.querySelectorAll('.deadline');
    let hasDuplication = false;
    const duplicatedTexts = [];
    deadlines.forEach(dl => {
      const text = dl.textContent;
      if (/OVERDUE.*OVERDUE/.test(text)) {
        hasDuplication = true;
        duplicatedTexts.push(text.trim());
      }
    });
    assert(
      !hasDuplication,
      "Test 1.G — Approvals Deadline Duplication (Bug Condition 1.4)",
      () => `Found approvals deadline duplication: [${duplicatedTexts.join(', ')}]`
    );
  } catch (e) {
    results.push({ name: "Test 1.G — Approvals Deadline Duplication (Bug Condition 1.4)", status: "ERROR", message: e.message });
  }

  return results;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runExplorationTests };
} else {
  window.runExplorationTests = runExplorationTests;
}
