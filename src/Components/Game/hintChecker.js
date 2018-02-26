module.exports = (hintCount, questionType) => {
  switch (questionType) {

  case 'defToOneRoot': case 'defToAllRoots':
    return hintCount === 0 ? 'highlightPrompt' : 'glowAnswer';
  
  case 'defCompletion':
    return hintCount !== 0 && 'glowAnswer';

  case 'defToAllRootsNoHighlight':
    return hintCount === 1
      ? 'highlightPrompt'
      : hintCount > 1 && 'glowAnswer';

  case 'defToWord':
    return hintCount === 1
      ? 'easyPrompt'
      : hintCount > 1 && 'glowAnswer';

  case 'defToCharsOneRoot': case 'defToCharsAllRoots':
    return hintCount === 1
      ? 'easyPrompt'
      : hintCount > 1 && 'giveAnswer';

  case 'rootInWordToDef':
    switch (hintCount) {
      case 0: return 'highlightPrompt'
      case 1: return 'easyPrompt'
      case 2: return 'hintButtonsOn'
      default: return 'glowAnswer'
    }

  case 'defToCharsAllRootsNoHighlight':
    switch (hintCount) {
      case 0: return
      case 1: return 'highlightPrompt'
      case 2: return 'easyPrompt'
      default: return 'giveAnswer'
    }  

  default: return;
  }
}
