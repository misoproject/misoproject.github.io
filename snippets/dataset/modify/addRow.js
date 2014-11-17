var ds = new Miso.Dataset({
  data : [
    { one : 12,  two : 40,  three : 40 }
  ]
}).fetch({
  success : function() {
    log("Row Count Before Add", this.length);
    
    this.add({
      one : 100,
      two : 100,
      three : 100
    });

    log("Row Count After Add", this.length);
  }
});