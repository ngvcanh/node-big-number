import { BigNumberData, BigNumberFormatOptions } from "./types";

class BigNumber{

  private _value: BigNumberData = '';

  static MAX_INTEGER = Number.MAX_SAFE_INTEGER;

  static MIN_INTEGER = Number.MIN_SAFE_INTEGER;

  static MAX_VALUE = Number.MAX_VALUE;

  static MIN_VALUE = Number.MIN_VALUE;

  constructor(value?: BigNumberData){
    if (value !== undefined){
      const val = this.revert(value.toString());
      
      if (typeof val === 'number'){
        if (!isNaN(val)){
          this._value = val;
        }
      }
      else{
        this._value = val;
      }
    }
  }

  equal(big: BigNumber | BigNumberData){
    let _big = BigNumber.from(big).toString()
    , _val = this.toString();
    
    const vNegative = !!_val.match(/^-/)
    , bNegative = !!_big.match(/^-/)
    , oneNegative = ((vNegative && !bNegative) || (!vNegative && bNegative));

    if (oneNegative) return false;

    _big = _big.replace('-', '');
    _val = _val.replace('-', '');

    if (_big.length !== _val.length) return false;

    for (let i = 0; i < _big.length; i++){
      if (_big[i] !== _val[i]) return false;
    }

    return true;
  }

  lt(big: BigNumber | BigNumberData){

  }

  lte(big: BigNumber | BigNumberData){

  }

  gt(big: BigNumber | BigNumberData){

  }

  gte(big: BigNumber | BigNumberData){

  }

  add(...bigs: Array<BigNumber | BigNumberData>){
    function addInt(a: string, b: string, decimal = true, addNext = false): [ string, boolean ]{
      const lengthA = a.length
      , lengthB = b.length
      , agb = lengthA > lengthB
      , upZero = Math.abs(lengthA - lengthB)
      , zeroA = agb ? '' : '0'.repeat(upZero)
      , zeroB = agb ? '0'.repeat(upZero) : ''
      , valA = Array.from((!decimal ? zeroA : '') + a + (decimal ? zeroA : '')).reverse()
      , valB = Array.from((!decimal ? zeroB : '') + b + (decimal ? zeroB : '')).reverse()
      , rs: Array<number | string> = [];

      let localAddNext = addNext;

      valA.forEach((val, index) => {
        let charVal = parseInt(val) + parseInt(valB[index]);
        if (localAddNext) charVal += 1;

        rs.push(charVal % 10);
        localAddNext = (charVal > 10);
      });

      return [rs.reverse().join(''), localAddNext];
    }

    function minusInt(a: string, b: string, decimal = true, giveBack = false): [ string, boolean ]{
      const lengthA = a.length
      , lengthB = b.length
      , agb = lengthA > lengthB
      , upZero = Math.abs(lengthA - lengthB)
      , zeroA = agb ? '' : '0'.repeat(upZero)
      , zeroB = agb ? '0'.repeat(upZero) : ''
      , valA = Array.from((!decimal ? zeroA : '') + a + (decimal ? zeroA : '')).reverse()
      , valB = Array.from((!decimal ? zeroB : '') + b + (decimal ? zeroB : '')).reverse()
      , rs: Array<number | string> = [];

      let localGiveBack = giveBack;
console.log({ valA, valB })
      valA.forEach((val, index) => {
        let charA = parseInt(val), charB = parseInt(valB[index]);
        
        localGiveBack && ++charB;
        localGiveBack = charA < charB;
        localGiveBack && (charA += 10);
console.log(localGiveBack)
        rs.push(charA - charB);
      });

      return [rs.reverse().join(''), localGiveBack];
    }
    
    function addSingle(a: string, b: string){
      const aNegative = !!a.match(/^-/), bNegative = !!b.match(/^-/)
      , oneNegative = ((aNegative && !bNegative) || (!aNegative && bNegative));

      if (oneNegative){
        const c = a;
        a = aNegative ? b : a;
        b = aNegative ? c : b;
      }

      const [ intA, decA ] = a.replace('-', '').split('.')
      , [ intB, decB ] = b.replace('-', '').split('.')
      , fn = oneNegative ? minusInt : addInt;

      let extra = false, rsDec = '', rsInt;

      if (decA !== undefined){
        if (decB !== undefined){
          [ rsDec, extra ] = fn(decA, decB);
        }
        else{
          rsDec = decA;
        }
      }
      else if (decB !== undefined){
        [ rsDec, extra ] = fn('0', decB);
      }

      [ rsInt, extra ] = fn(intA, intB, false, extra);

      extra && (rsInt = `${ oneNegative ? '-9' : '' }${ rsInt }`);
      const existDec = (decA !== undefined || decB !== undefined);

      return `${ aNegative && !oneNegative ? '-' : '' }${ rsInt }${ existDec ? '.' + rsDec : '' }`
    }

    let rs = this.toString();

    bigs.forEach(value => {
      const _value = BigNumber.from(value).toString();
      rs = addSingle(rs, _value);
    });

    return BigNumber.from(rs);
  }

  toString(){
    return this._value.toString();
  }

  format(options?: BigNumberFormatOptions){
    return BigNumber.format(this._value, options);
  }

  revert(value: string){
    return BigNumber.revert(value);
  }

  revertFormat(value: string){
    return BigNumber.revertFormat(value);
  }

  revertComma(value: string){
    return BigNumber.revertComma(value);
  }

  match(value: BigNumberData){
    return BigNumber.match(value);
  }

  isMatch(value: BigNumberData){
    return BigNumber.isMatch(value);
  }

  isNumber(value: BigNumberData){
    return BigNumber.isNumber(value);
  }

  isInt(value: BigNumberData){
    return BigNumber.isInt(value);
  }

  isFormat(value: string){
    return BigNumber.isFormat(value);
  }

  isComma(value: string){
    return BigNumber.isComma(value);
  }

  isOutOfMax(value: BigNumberData){
    return BigNumber.isOutOfMax(value);
  }

  isOutOfMin(value: BigNumberData){
    return BigNumber.isOutOfMin(value);
  }

  static from(value: BigNumber | BigNumberData){
    if (value instanceof BigNumber) return value;
    return new this(value);
  }

  static format(value: BigNumberData, options?: BigNumberFormatOptions){
    const _value = this.from(value).toString();
    if (!_value) return _value;

    const arr = _value.split('.');
    const existDec = arr.length > 1;

    const [ _int, _dec ] = arr;
    if (_int.length < 4) return _value;

    const { comma, decimal = true, trim } = options ?? {};
    const separator = comma ? ',' : '.';
    let formatted;

    if (_int.length < 16){
      formatted = new Intl.NumberFormat(comma ? 'de-DE': 'en-EN').format(+_int);
    }
    else{
      formatted = Array.from(_int)
        .reverse()
        .map((char, index) => index % 3 === 2 ? `,${ char }` : char)
        .reverse()
        .join('')
        .replace(/^,/, '');
  
      if (comma) formatted = formatted.replace(/,/g, '.');
    }
  
    const trimDecimal = (decimal === false || decimal <= 0);
    const addDecimal = existDec && !trimDecimal && (!trim || _dec.length);
    const decimalVal = _dec.substring(0, typeof decimal === 'number' ? decimal : undefined);
  
    formatted = [ formatted ].concat(addDecimal ? [ decimalVal ] : []).join(separator);
    return formatted;
  }

  static revert(value: string){
    if (!this.isMatch(value)) return NaN;
    if (this.isFormat(value)) return this.revertFormat(value);
    if (this.isComma(value)) return this.revertComma(value);
    return value;
  }

  static revertFormat(value: string){
    if (!this.isFormat(value)) return NaN;
    return value.replace(/,/g, '');
  }

  static revertComma(value: string){
    if (!this.isComma(value)) return NaN;
    return value.replace(/\./g, '').replace(',', '.');
  }

  static match(value: BigNumberData){
    return value.toString().match(/^-?(\d*\.?)\d*/);
  }

  static isMatch(value: BigNumberData){
    return this.isNumber(value)
    || this.isFormat(value.toString())
    || this.isComma(value.toString());
  }

  static isNumber(value: BigNumberData){
    return !!this.match(value);
  }

  static isInt(value: BigNumberData){
    return !!value.toString().match(/^-?\d+$/);
  }

  static isFormat(value: string){
    return !!value.match(/^-?\d{1,3}(,\d{3})*(\.\d*)?$/);
  }

  static isComma(value: string){
    return !!value.match(/^-?\d{1,3}(\.\d{3})*(,\d*)?$/);
  }

  static isOutOfMax(value: BigNumberData){
    return parseFloat(value.toString()) > BigNumber.MAX_VALUE; 
  }

  static isOutOfMin(value: BigNumberData){
    return parseFloat(value.toString()) < BigNumber.MAX_VALUE; 
  }

}

export default BigNumber;