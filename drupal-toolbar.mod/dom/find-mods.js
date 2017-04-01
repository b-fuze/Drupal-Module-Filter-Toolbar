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
  indexCategories() {
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
    
    for (var i=0,l=fieldsets.length; i<l; i++) {
      var fsetDOM    = fieldsets[i];
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
      
      // Loop category modules
      for (var j=0,l2=modules.length; j<l2; j++) {
        var modDOM         = modules[j];
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
    }
    
    // Sort modules and cats
    // fsetArr.sort(function(a, b) {
    //   return aBeforeB(a[0], b[0]) ? -1 : 1;
    // });
    //
    // modArr.sort(function(a, b) {
    //   return aBeforeB(a[0], b[0]) ? -1 : 1;
    // });
    
    return {
      categories: fsetArr.reverse(),
      categoryMap: fsetObj,
      modules: modArr.reverse(),
      moduleMap: modMap,
      model: mainModel,
      focusModel: focusModel
    };
  }
}
