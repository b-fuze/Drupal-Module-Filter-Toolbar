reg.interface = filterEntries;

// Sanitize
function regexSanitize(str) {
  var match = /([\[\]()\-\.{}+*^$!?\\])/g;
  
  return str.replace(match, "\\$1");
}

function filterEntries(query, entries) {
  console.log("Querying");
  
  var queryRaw = query.trim().toLowerCase().replace(/\s+/, " ");
  var queryRawLen = queryRaw.length;
  query = regexSanitize(queryRaw);
  
  var nomatch = entries.slice();
  var match = [];
  
  // Regex's
  var beginWordMatch = new RegExp("^" + query + "\\b");
  var beginMatch = new RegExp("^" + query);
  var wordMatch = new RegExp("\\b" + query + "\\b");
  
  // For matching exactly
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    
    if (anime[0] === queryRaw) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Add highlighting
      anime[1] = "\n" + anime[0] + "\n";
    }
  }
  
  // For matching the beginning word(s)
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    
    if (beginWordMatch.test(anime[0])) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Add highlighting
      anime[1] = "\n" + anime[0].substr(0, queryRawLen) + "\n" + anime[0].substr(queryRawLen);
    }
  }
  
  // For matching the beginning
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    
    if (beginMatch.test(anime[0])) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Add highlighting
      anime[1] = "\n" + anime[0].substr(0, queryRawLen) + "\n" + anime[0].substr(queryRawLen);
    }
  }
  
  // For matching the word(s)
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    var matchIndex = anime[0].indexOf(queryRaw);
    
    if (wordMatch.test(anime[0])) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Add highlighting
      anime[1] = anime[0].substr(0, matchIndex) + "\n" +
                 anime[0].substr(matchIndex, queryRawLen) + "\n" +
                 anime[0].substr(matchIndex + queryRawLen);
    }
  }
  
  // For just matching parts of the word(s)
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    var matchIndex = anime[0].indexOf(queryRaw);
    
    if (matchIndex !== -1) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Add highlighting
      anime[1] = anime[0].substr(0, matchIndex) + "\n" +
                 anime[0].substr(matchIndex, queryRawLen) + "\n" +
                 anime[0].substr(matchIndex + queryRawLen);
    }
  }
  
  // For random word matching beginning
  var titleWords = queryRaw.split(" ");
  arrayLoop:
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    var aTitleSubstr = 0;
    var matchedRW = true;
    var matchedTitle = anime[0];
    var matchedTitleLen = matchedTitle.length;
    
    animeLoop:
    for (var j=0,l=titleWords.length; j<l; j++) {
      var matchTWord = titleWords[j];
      var wordIndex = matchedTitle.substr(aTitleSubstr, matchedTitleLen).toLowerCase().indexOf(matchTWord);
      
      if (wordIndex === -1 || j === 0 && wordIndex !== 0) {
        matchedRW = false;
        break animeLoop;
      } else {
        // Add highlighting
        var highlightStart = aTitleSubstr + wordIndex;
        
        matchedTitle = matchedTitle.substr(0, highlightStart) + "\n" +
                       matchedTitle.substr(highlightStart, matchTWord.length) + "\n" +
                       matchedTitle.substr(highlightStart + matchTWord.length, matchedTitleLen);
        
        aTitleSubstr = wordIndex + matchTWord.length;
      }
    }
    
    if (matchedRW) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Finally add the highlighting
      anime[1] = matchedTitle;
    }
  }
  
  // For random word matching anywhere
  arrayLoop:
  for (var i=nomatch.length-1; i>-1; i--) {
    var anime = nomatch[i];
    var aTitleSubstr = 0;
    var matchedRW = true;
    var matchedTitle = anime[0];
    var matchedTitleLen = matchedTitle.length;
    
    animeLoop:
    for (var j=0,l=titleWords.length; j<l; j++) {
      var matchTWord = titleWords[j];
      var wordIndex = matchedTitle.substr(aTitleSubstr, matchedTitleLen).toLowerCase().indexOf(matchTWord);
      
      if (wordIndex === -1) {
        matchedRW = false;
        break animeLoop;
      } else {
        // Add highlighting
        var highlightStart = aTitleSubstr + wordIndex;
        
        matchedTitle = matchedTitle.substr(0, highlightStart) + "\n" +
                       matchedTitle.substr(highlightStart, matchTWord.length) + "\n" +
                       matchedTitle.substr(highlightStart + matchTWord.length, matchedTitleLen);
        
        aTitleSubstr = wordIndex + matchTWord.length;
      }
    }
    
    if (matchedRW) {
      match.push(anime);
      nomatch.splice(i, 1);
      
      // Finally add the highlighting
      anime[1] = matchedTitle;
    }
  }
  
  return match;
}
