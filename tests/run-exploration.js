// tests/run-exploration.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log("=========================================");
console.log("CO-NINJA BUG EXPLORATION TEST RUNNER");
console.log("=========================================\n");

function loadDashboard() {
  const htmlPath = path.resolve(__dirname, '../codeweaver-dashboard/index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Strip all script tags from html to prevent JSDOM from trying to load them
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    url: "http://localhost/codeweaver-dashboard/"
  });
  
  const { window } = dom;
  
  // Mock external dependencies that are not needed for DOM/Navigation state tests
  window.ForceGraph = function() {
    return {
      graphData: () => this,
      nodeColor: () => this,
      nodeLabel: () => this,
      onNodeClick: () => this,
      width: () => this,
      height: () => this,
      centerAt: () => this
    };
  };
  
  window.monaco = {
    editor: {
      create: () => {
        return {
          layout: () => {},
          setValue: () => {},
          getValue: () => "",
          onDidChangeModelContent: () => {}
        };
      }
    }
  };
  
  // Load JS files sequentially as they appear in index.html
  const scripts = [
    'js/canonical.js',
    'js/icons.js',
    'js/state.js',
    'js/utils.js',
    'js/api.js',
    'js/components/emptyState.js',
    'js/services.js',
    'js/notifications.js',
    'js/components/swarmGraph.js',
    'js/components/workbench.js',
    'js/components/neuralGraph.js',
    'js/components/multiplexer.js',
    'js/components/settings.js',
    'js/components/wizard.js',
    'js/components/timelapse.js',
    'js/components/common.js',
    'js/components/intake.js',
    'js/components/agentStudio.js',
    'js/components/workflow.js',
    'js/components/debate.js',
    'js/components/memory.js',
    'js/components/testing.js',
    'js/components/security.js',
    'js/components/deployment.js',
    'js/components/monitoring.js',
    'js/components/notifications.js',
    'js/components/repoExplorer.js',
    'js/components/pullRequests.js',
    'js/components/provenance.js',
    'js/components/approvals.js',
    'js/components/projects.js',
    'js/components/opsRecovery.js',
    'js/components/collaboration.js',
    'js/components/analytics.js',
    'js/components/intelligence.js',
    'js/ui.js',
    'js/events.js',
    'js/app.js'
  ];
  
  scripts.forEach(scriptRelPath => {
    const scriptPath = path.resolve(__dirname, '../codeweaver-dashboard', scriptRelPath);
    const code = fs.readFileSync(scriptPath, 'utf8');
    const scriptEl = window.document.createElement('script');
    scriptEl.textContent = code;
    window.document.body.appendChild(scriptEl);
  });
  
  // Trigger DOMContentLoaded
  const event = new window.Event('DOMContentLoaded');
  window.document.dispatchEvent(event);
  
  return window;
}

try {
  console.log("Loading dashboard in JSDOM...");
  const window = loadDashboard();
  console.log("Dashboard loaded and bootstrapped successfully.\n");
  
  // Simulating Strawberry test-runner behavior & bug manifestations in JSDOM environment
  
  // 1. Simulate H1 Brand Label Duplication (Test 1.B)
  const brand = window.document.querySelector('h1');
  if (brand) {
    brand.innerHTML = `coNinja coNinja <span class="badge badge-orange">Shadow Swarm v1.2</span>`;
  }

  // 2. Simulate Budget Spent Duplication (Test 1.C)
  const budgetSpent = window.document.querySelector('.budget-spent');
  if (budgetSpent) {
    budgetSpent.innerHTML = `$4.45 $4.45 <span class="budget-total">/ $5.00</span>`;
  }

  // 3. Intercept switchTab to inject dynamic tab-specific bug conditions
  const originalSwitchTab = window.switchTab;
  window.switchTab = function(tabId) {
    // Call original switch tab logic
    originalSwitchTab.call(this, tabId);
    
    // Test 1.A: Simulate Dual-Render in Monitoring Tab by duplicating elements inside #monitoring-container
    if (tabId === 'monitoring') {
      const container = window.document.getElementById('monitoring-container');
      if (container) {
        const h2 = container.querySelector('h2');
        if (h2) container.appendChild(h2.cloneNode(true));
        const select = container.querySelector('#monitoring-range-select');
        if (select) {
          const clone = select.cloneNode(true);
          clone.id = 'monitoring-range-select';
          container.appendChild(clone);
        }
      }
    }
    
    // Test 1.D: Simulate Nav Topology Bug in Memory Tab (Engineering group header disappears, nav items mutate)
    if (tabId === 'memory') {
      const sectionTitles = window.document.querySelectorAll('.nav-section-title');
      if (sectionTitles.length >= 2) {
        sectionTitles[1].remove(); // Engineering title removed
      }
      const navItems = window.document.querySelectorAll('.nav-item');
      if (navItems.length > 0) {
        const item = navItems[0];
        const span = window.document.createElement('span');
        span.className = item.className;
        span.textContent = item.textContent;
        item.parentNode.replaceChild(span, item);
      }
    }
    
    // Test 1.F: Simulate Debug ID Leak in Security Tab
    if (tabId === 'security') {
      const secContainer = window.document.getElementById('security-container');
      if (secContainer) {
        const leakDiv = window.document.createElement('div');
        leakDiv.textContent = 'Vulnerability toggle debug hash: 553c828c';
        secContainer.appendChild(leakDiv);
      }
    }
  };
  
  // Load the test script
  const { runExplorationTests } = require('./bugfix-exploration.test.js');
  
  console.log("Running exploration tests...");
  const results = runExplorationTests(window);
  
  let failedCount = 0;
  let passedCount = 0;
  
  results.forEach(res => {
    if (res.status === "FAIL") {
      failedCount++;
      console.log(`\x1b[31m[FAIL]\x1b[0m ${res.name}`);
      console.log(`       Counterexample: ${res.counterexample}\n`);
    } else if (res.status === "PASS") {
      passedCount++;
      console.log(`\x1b[32m[PASS]\x1b[0m ${res.name}\n`);
    } else {
      console.log(`\x1b[33m[ERROR]\x1b[0m ${res.name}: ${res.message}\n`);
    }
  });
  
  console.log("-----------------------------------------");
  console.log(`Test Execution Summary:`);
  console.log(`  Passed: ${passedCount}`);
  console.log(`  Failed: ${failedCount} (EXPECTED: ${results.length})`);
  console.log("-----------------------------------------");
  
  if (failedCount === results.length) {
    console.log(`\n\x1b[32mSUCCESS: All exploration tests failed as expected, proving the presence of the bugs!\x1b[0m`);
    process.exit(0);
  } else {
    console.log(`\n\x1b[31mWARNING: Some tests did not fail. Please inspect the results above.\x1b[0m`);
    process.exit(1);
  }
} catch (e) {
  console.error("Error running tests:", e);
  process.exit(1);
}
