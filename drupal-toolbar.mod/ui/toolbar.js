function ToolBar() {
  lces.types.component.call(this);
  var that = this;
  
  // Make DOM elements
  var main;
  var input;
  var inputClear;
  var queryStatus;
  var matches;
  var matchesHide;
  var queryModulesVisual;
  
  this.input = input = jSh.c("input", {
    prop: {
      type: "text",
      placeholder: "Filter..."
    }
  });
  
  inputClear = jSh.c("button", {
    sel: ".dum-main-input-clear",
    child: jSh.c("span", null, "×")
  });
  
  this.queryStatus = queryStatus = jSh.d(".dum-main-query-status.dum-empty-query.dum-status-indexing", "Indexing modules...");
  
  this.matches = matches = jSh.d(".dum-main-matches");
  
  matchesHide = jSh.c("button", {
    sel: ".dum-matches-hide",
    text: "COLLAPSE",
    events: {
      click() {
        that.matchesVisible = false;
        
        input.focus();
      }
    }
  });
  
  queryModulesVisual = jSh.d({
    sel: ".dum-main-is-query-modules.dum-main-item",
    text: "MODULES",
    events: {
      mousedown(e) {
        e.preventDefault();
      },
      
      click() {
        that.queryModules = !that.queryModules;
        input.focus();
      }
    }
  });
  
  this.bar = main = jSh.d(".dum-main-bar", null, [
    jSh.d(".dum-main-input-wrap.dum-main-item", null, [
      input,
      inputClear
    ]),
    
    jSh.d(".dum-main-query-status-wrap.dum-main-item", null, [
      queryStatus
    ]),
    
    queryModulesVisual,
    
    jSh.d(".dum-matches-wrap", null, [
      matchesHide,
      matches
    ])
  ]);
  
  // LCES States
  this.setState("ready", false);
  this.setState("matchesVisible", false);
  this.setState("query", "");
  this.setState("queryModules", true);
  this.setState("curMatches", null);
  
  // Events
  inputClear.addEventListener("click", function() {
    that.query = "";
  });
  
  // Only do stuff when the bar is ready
  function onlyWhenReady() {
    return that.ready;
  }
  
  this.addStateCondition("query", onlyWhenReady);
  this.addStateCondition("matchesVisible", onlyWhenReady);
  this.addStateCondition("queryModules", onlyWhenReady);
  this.addStateCondition("curMatches", onlyWhenReady);
  
  // Start filtering input when all things on the page have been loaded
  this.addStateListener("ready", function(ready) {
    queryStatus.classList.remove("dum-status-indexing");
    queryStatus.textContent = "Empty query";
    
    // Add input events
    input.addEventListener("input", function() {
      that.query = this.value;
    });
    
    input.addEventListener("keydown", function(e) {
      switch (e.keyCode) {
        case 13:
          if (that.query.trim() && e.ctrlKey) {
            that.matchesVisible = !that.matchesVisible;
          }
          break;
        case 77:
          if (e.ctrlKey) {
            that.queryModules = !that.queryModules;
          }
          break;
      }
    });
    
    // Check if there's anything in the <input>
    var inputValue = input.value.trim();
    
    if (inputValue) {
      that.query = inputValue;
    }
  });
  
  // Update input when necessary
  this.addStateListener("query", function(query) {
    if (query !== input.value)
      input.value = query;
    
    if (!query.trim()) {
      that.queryStatus.classList.add("dum-empty-query");
    } else {
      that.queryStatus.classList.remove("dum-empty-query");
    }
  });
  
  this.addStateListener("curMatches", function(newMatches, domMatches) {
    matches.innerHTML = "";
    
    for (var i=0,l=newMatches.length; i<l; i++) {
      var matchValue = newMatches[i];
      
      matches.appendChild(jSh.d({
        sel: ".dum-query-match-row",
        text: matchValue,
        prop: {
          dataDumDom: domMatches[matchValue]
        },
        events: {
          click() {
            console.log(this.dataDumDom);
          }
        }
      }));
    }
  });
  
  this.addStateListener("matchesVisible", function(visible) {
    if (visible) {
      main.classList.add("dum-expanded");
    } else {
      main.classList.remove("dum-expanded");
    }
  });
  
  this.addStateListener("queryModules", function(queryModules) {
    if (queryModules) {
      queryModulesVisual.textContent = "MODULES";
    } else {
      queryModulesVisual.textContent = "CATEGORIES";
    }
  });
  
  // Done, append to <body>
  document.body.appendChild(main);
}

jSh.inherit(ToolBar, lces.types.component);

reg.interface = ToolBar;
