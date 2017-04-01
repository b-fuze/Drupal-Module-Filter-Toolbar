// Nothing Drupal Modules bla bla bla
AUR_NAME = "Plz fix modules... Plz...";
AUR_DESC = "Wtf man";
AUR_VERSION = [0, 1, 0];
AUR_AUTHORS = ["Mike32 (b-fuze)"];
AUR_RESTART = false;

var filter = AUR.import("./util/filter-results")
var findMods = AUR.import("./dom/find-mods");
var ToolBar = AUR.import("./ui/toolbar");

AUR.on("load", function() {
  setTimeout(function() {
    var catModMap = findMods.indexCategories();
    var bar = new ToolBar();
    
    var resultModel = catModMap.model;
    
    var matchedCats;
    var matchedMods;
    var lastQueryUpdate = null;
    var lastSwitch = null;
    
    var matchedCatsMap = {};
    var matchedModsMap = {};
    
    var curMatches;
    var curMatchesDOM;
    var curMatchIndex = -1;
    
    function updateResults() {
      if (matchedCats && (lastQueryUpdate !== bar.query.trim() || lastSwitch !== bar.queryModules)) {
        lastQueryUpdate = bar.query.trim();
        lastSwitch = bar.queryModules;
        
        // Add matching rows stuff
        bar.matches.innerHTML = "";
        
        var frag         = jSh.docFrag();
        var queryModules = bar.queryModules;
        var iterateArr   = queryModules ? matchedMods : matchedCats;
        var iterateDOM   = queryModules ? catModMap.moduleMap : catModMap.categoryMap;
        
        for (var i=0,l=iterateArr.length; i<l; i++) {
          var res = iterateArr[i];
          var titleArr = [];
          var titleSplit = res[1].split("\n");
          let nameObj = iterateDOM[res[0]];
          let nameDOM = nameObj.dom;
          
          for (var j=0,l2=titleSplit.length; j<l2; j++) {
            if (j % 2 !== 0)
              titleArr.push(jSh.c("b", null, titleSplit[j]));
            else
              titleArr.push(jSh.t(titleSplit[j]));
          }
          
          if (!queryModules) {
            var modCount = nameObj.modules.length;
            titleArr.push(jSh.c("i", null, " — " + modCount + " module" + (modCount === 1 ? "" : "s")))
          }
          
          frag.appendChild(jSh.d({
            sel: ".dum-row-match",
            child: titleArr,
            // attr: {
            //   "data-aur-ss-link": res[1],
            //   [aj.ignoreAttr]: ""
            // },
            // prop: {
            //   href: res[1],
            //   title: res[0] + "\n\n" + res[1]
            // }
            events: {
              click() {
                bar.matchesVisible = false;
                
                lces.ui.scrollY = nameDOM;
                nameObj.model.focused = true;
                
                bar.input.focus();
              }
            }
          }));
        }
        
        bar.matches.appendChild(frag);
      }
    }
    
    function reQuery(query) {
      bar.matches.innerHTML = "";
      
      if (!query.trim()) {
        bar.queryStatus.innerHTML = "Empty query";
        curMatches = null;
        curMatchesDOM = null;
        lastQueryUpdate = null;
        
        // Update elements
        for (var i=0,l=catModMap.categories.length; i<l; i++) {
          var curCat = catModMap.categories[i][0];
          catModMap.categoryMap[curCat].model.matched = false;
        }
        
        for (var i=0,l=catModMap.modules.length; i<l; i++) {
          var curMod = catModMap.modules[i][0];
          catModMap.moduleMap[curMod].model.matched = false;
        }
        
        return;
      }
      
      matchedCats = filter(query, catModMap.categories);
      matchedMods = filter(query, catModMap.modules);
      
      var catCount = matchedCats.length;
      var modCount = matchedMods.length;
      
      // Update hashmap
      matchedCatsMap = {};
      matchedModsMap = {};
      
      for (var i=0; i<catCount; i++) {
        matchedCatsMap[matchedCats[i][0]] = 1;
      }
      
      for (var i=0; i<modCount; i++) {
        matchedModsMap[matchedMods[i][0]] = 1;
      }
      
      // Update elements
      for (var i=0,l=catModMap.categories.length; i<l; i++) {
        var curCat = catModMap.categories[i][0];
        catModMap.categoryMap[curCat].model.matched = !!matchedCatsMap[curCat];
      }
      
      for (var i=0,l=catModMap.modules.length; i<l; i++) {
        var curMod = catModMap.modules[i][0];
        catModMap.moduleMap[curMod].model.matched = !!matchedModsMap[curMod];
      }
      
      bar.queryStatus.innerHTML = "";
      bar.queryStatus.appendChild([
        jSh.t("Matched "),
        jSh.c("span", {
          sel: ".dum-matches-link",
          text: catCount + " " + (catCount === 1 ? "category" : "categories"),
          events: {
            click() {
              bar.queryModules = false;
              bar.matchesVisible = true;
              
              bar.input.focus();
            }
          }
        }),
        jSh.t(" and "),
        jSh.c("span", {
          sel: ".dum-matches-link",
          text: modCount + " module" + (modCount === 1 ? "" : "s"),
          events: {
            click() {
              bar.queryModules = true;
              bar.matchesVisible = true;
              
              bar.input.focus();
            }
          }
        }),
      ]);
      
      curMatches    = bar.queryModules ? matchedMods : matchedCats;
      curMatchesDOM = bar.queryModules ? catModMap.moduleMap : catModMap.categoryMap;
      curMatchIndex = -1;
      
      if (bar.matchesVisible) {
        updateResults();
      }
    }
    
    bar.addStateListener("matchesVisible", function() {
      updateResults();
    });
    
    bar.addStateListener("query", reQuery);
    bar.addStateListener("queryModules", function(queryModules) {
      updateResults();
      resultModel.queryModules = queryModules;
      
      curMatches    = queryModules ? matchedMods : matchedCats;
      curMatchesDOM = queryModules ? catModMap.moduleMap : catModMap.categoryMap;
      curMatchIndex = 0;
    });
    
    bar.input.addEventListener("keyup", function(e) {
      if (!bar.query.trim())
        return;
      
      if (curMatchesDOM && e.keyCode === 13 && !e.ctrlKey) {
        if (e.shiftKey) {
          curMatchIndex--;
          
          if (curMatchIndex < 0) {
            curMatchIndex = curMatches.length - 1;
          }
        } else {
          curMatchIndex++;
          
          if (curMatchIndex >= curMatches.length) {
            curMatchIndex = 0;
          }
        }
        
        
        if (curMatchesDOM) {
          var curItem = curMatchesDOM[curMatches[curMatchIndex][0]];
          var dom = curItem.dom;
          
          lces.ui.scrollY = dom;
          curItem.model.focused = true;
        }
      }
      
      if (e.keyCode === 27) {
        bar.matchesVisible = false;
      }
    });
    
    var inputIsBlurred = false;
    bar.input.addEventListener("blur", function() {
      inputIsBlurred = true;
    });
    
    bar.input.addEventListener("focus", function() {
      inputIsBlurred = false;
    });
    
    // Start typing in the filter automatically
    document.addEventListener("keydown", function(e) {
      if (!inputIsBlurred || document.activeElement !== document.body)
        return false;
      
      // TODO: Do I add numpad keys here too, or?
      if (!e.ctrlKey && !e.altKey &&
          e.keyCode > 47 && e.keyCode < 91) {
        bar.input.value = "";
        bar.input.focus();
      }
    });
    
    bar.input.focus();
  }, 10);
});
