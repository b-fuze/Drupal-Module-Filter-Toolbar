//

reg.interface = function aBeforeB(a, b) {
  a = (a + "");
  b = (b + "");
  
  if (a === b)
    return true; // Going with original order then
  
  var charScale = "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
  var chars = Math.min(a.length, b.length);
  
  var strA = false, strB = false;
  
  // Check if beginning's the same
  if (a.slice(0, chars) === b.slice(0, chars))
    return a.length > b.length;
  
  for (var i=0; i<chars; i++) {
    var charA = a[i], charAValue;
    var charB = b[i], charBValue;
      
    if (charA !== charB) {
      charAValue = charScale.indexOf(charA) + 1;
      charBValue = charScale.indexOf(charB) + 1;
      
      if (charAValue === 0 && charBValue === 0) {
        charAValue = charA.charCodeAt(0);
        charBValue = charB.charCodeAt(0);
        
        charAValue = charAValue > charBValue ? 1 : 0;
        charBValue = Number(!charAValue);
      }
      
      strA = charAValue > charBValue;
      strB = !strA;
      
      break;
    }
  }
  
  return !strA;
}
