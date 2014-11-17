// dummy phone number class
var PhoneNumber = function(areacode, number) {
  this.areacode = +areacode;
  this.number = +number;
  return this;
};
PhoneNumber.prototype.valueOf = function() {
  return this.areacode * 10000000 + this.number;
};
PhoneNumber.prototype.toString = function() {
  return this.areacode + " " + this.number;
};

// Phone type. 
// Converts a phone type to a phone type
Miso.Dataset.types.phone = {  
  name : "phone",
  // match phone numbers of the format:
  // XXX-XXX-XXXX or XXX XXX XXXX or XXXXXXXXXX
  regexp : /^(\d{3})[-|\s]?(\d{3})[-|\s]?(\d{4})$/,
  
  // tests whether an input string is a phone number
  test : function(v) {
    if (typeof v === 'string' || this.regexp.test( v ) ) {
      return true;
    } else {
      return false;
    }
  },

  // takes a string and converts it to a Phone type
  coerce : function(v, options) {
    if (_.isNull(v)) {
      return null;
    }
    var split = (options.regexp || this.regexp).exec(v);
    v = new PhoneNumber(split[1], split[2] + split[3]);
    return _.isNaN(v) ? null : v;
  },

  // compares two PhoneNumbers. First compares by area
  // code, and then by the phone number
  compare : function(n1, n2) {
    var n1Value = n1.valueOf(),
        n2Value = n2.valueOf();
    if (n1Value < n2Value) { return -1; }
    if (n1Value > n2Value) { return  1; }
    return 0;
  },

  // returns the numeric value of this datatype.
  numeric : function(number) {
    return number.valueOf();
  }
};

var ds = new Miso.Dataset({
 data : [
    { phone : "413 555 5555" },
    { phone : "413-444-4444" },
    { phone : "999 555 5555" }
  ]
});
ds.fetch({
  success : function() {
    // do things here after data successfully fetched.
    // note 'this' references the dataset.
    log("Column type detected: " + this.column("phone").type);
    log("Am I a PhoneNumber? " + 
      (this.column("phone").data[0] instanceof PhoneNumber)
    );
    log(this.column("phone").data[0].toString());
  }
});