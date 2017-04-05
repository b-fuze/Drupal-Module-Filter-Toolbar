var aBeforeB;

AUR.onLoaded("/util/a-before-b", function() {
  aBeforeB = AUR.import("/util/a-before-b");
});

function HighlightedResult(dom, isModule, mainModel, focusModel, name) {
  lces.types.component.call(this);
  var that = this;
  
  this.setState("highlighted", false);
  this.addStateListener("highlighted", function(highlighted) {
    if (highlighted) {
      dom.classList.add("dum-result-highlight");
    } else {
      dom.classList.remove("dum-result-highlight");
    }
  });
  
  function checkHighlight() {
    if (that.matched && (isModule === mainModel.queryModules) && (mainModel.highlightAll || that.focused)) {
      that.highlighted = true;
    } else {
      that.highlighted = false;
    }
  }
  
  this.setState("matched", false);
  this.addStateListener("matched", checkHighlight);

  mainModel.addStateListener("queryModules", checkHighlight);
  
  this.setState("focused", false);
  this.addStateListener("focused", function(focused) {
    checkHighlight();
    
    if (focused) {
      dom.classList.add("dum-result-focus");
    } else {
      dom.classList.remove("dum-result-focus");
    }
  });
  
  mainModel.addStateListener("highlightAll", checkHighlight);
  focusModel.addMember(this);
  
  // End
  dom.classList.add("dum-potential-highlight");
}

jSh.inherit(HighlightedResult, lces.types.component);

reg.interface = {
  indexCategories(done) {
    var validFieldset = /^edit-modules-/i;
    var fieldsets = jSh("fieldset").filter(function(fset) {
      return validFieldset.test(fset.id);
    });
    
    var fsetArr = [];
    var fsetObj = {};
    var modArr  = [];
    var modMap  = {};
    
    var mainModel = lces.new();
    var focusModel = lces.new("group");
    
    mainModel.setState("queryModules", true);
    mainModel.setState("highlightAll", true);
    focusModel.setState("focused");
    focusModel.setExclusiveState("focused", true, 1);
    
    var fsCount = fieldsets.length;
    var maxFS   = 4;
    var maxMod  = 10;
    
    // The `addModules` and `addCategories` functions are invoked
    // via setTimeout instead of one big simple for loop (initial
    // implementation) to implement asynchronous behaviour.
    //
    // This was implemented because DMFT would make the browser freeze
    // for a bit while it was busy trying to find all the modules on
    // a page, they try to prevent that.
    
    // Loop fields
    function addModules(fieldset, modules, index, next) {
      var modCount    = modules.length;
      var curMaxIndex = modCount <= maxMod
                        ? modCount
                        : Math.min(index + maxMod, modCount);
      
      for (; index<curMaxIndex; index++) {
        var modDOM         = modules[index];
        var modName        = modDOM.textContent.trim();
        var modMachineName = modName.toLowerCase();
        
        modMap[modMachineName] = {
          dom: modDOM,
          cat: fieldset,
          name: modName,
          model: new HighlightedResult(modDOM, true, mainModel, focusModel, modName)
        };
        
        modArr.push([modMachineName, ""]);
        fieldset.modules.push(modMachineName);
      }
      
      // Increment to confirm status or move on to next batch of mods
      index++;
      
      if (index >= modCount) {
        // We're done, move on to the next category
        next();
      } else {
        // Wait (20ms) before we move on to the next batch of modules
        setTimeout(addModules, 20, fieldset, modules, index, next);
      }
    }
    
    function addCategories(index) {
      var fs = fieldsets[index];
      
      if (fs) {
        var fsetDOM    = fs;
        var fsetCapDOM = fsetDOM.jSh(".fieldset-title")[0];
        
        var fieldset = {
          dom: fsetCapDOM,
          name: (fsetDOM.jSh(".fieldset-title")[0].jSh(0).nextSibling.wholeText + "").toLowerCase().trim(),
          modules: [],
          model: new HighlightedResult(fsetCapDOM, false, mainModel, focusModel)
        };
        
        fsetObj[fieldset.name] = fieldset;
        fsetArr.push([fieldset.name, ""]);
        
        // Get category modules
        var modules = fsetDOM.jSh("tbody tr td > label[for]");
        
        // Asynchronously get the modules
        addModules(fieldset, modules, 0, function() {
          index++;
          
          if (index >= maxFS && index % maxFS === 0) {
            // Wait a bit (75ms) for other stuff to happen then continue
            setTimeout(addCategories, 75, index);
          } else {
            addCategories(index);
          };
        });
      } else {
        done({
          categories: fsetArr.reverse(),
          categoryMap: fsetObj,
          modules: modArr.reverse(),
          moduleMap: modMap,
          model: mainModel,
          focusModel: focusModel
        });
      }
    }
    
    // Start asynchronously loading modules and categories
    addCategories(0);
  }
}
