const Word = (val, data) => {
  return {
    value: val,
    components: data['components'],
    definition: data['definition'],
    
    get roots () {
      return this.components.filter((c) => c.type === 'root');
    }
  }
}

export default Word;
