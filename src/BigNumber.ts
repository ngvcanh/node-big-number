import { BigNumberData, BigNumberFormatOptions } from "./types";
import {
  add,
  aEqualB,
  aGreaterThanB,
  aGreaterThanOrEqualB,
  aLessThanB,
  aLessThanOrEqualB
} from "./utils";

const SORT = {
  bubble(bigs: Array<BigNumber>){
    const length = bigs.length;

    for (let i = 0; i < length - 1; i++){
      let swapped = Boolean(true);
      
      for (let j = 0; j < length - i - 1; j++){
        if (bigs[j].gt(bigs[j + 1])){
          const temp = bigs[j];
          bigs[j] = bigs[j + 1];
          bigs[j + 1] = temp;
          swapped = false;
        }
      }
    
      if (swapped === true) break;
    }

    return bigs;
  },
  selection(bigs: Array<BigNumber>){
    const length = bigs.length;

    for (let step = 0; step < length - 1; step++) {
      let min_idx = step;

      for (let i = step + 1; i < length; i++) {
        if (bigs[i].lt(bigs[min_idx])) min_idx = i;
      }

      let temp = bigs[step];
      bigs[step] = bigs[min_idx];
      bigs[min_idx] = temp;
    }

    return bigs;
  },
  insertion(bigs: Array<BigNumber>){
    const length = bigs.length;
    
    for (let step = 1; step < length; step++) {
      const key = bigs[step];
      let j = step - 1;

      while (j >= 0 && key.lt(bigs[j])){
        bigs[j + 1] = bigs[j];
        --j;
      }

      bigs[j + 1] = key;
    }

    return bigs;
  },
  // quick(){},
  // radix(){},
  // merge(bigs: Array<BigNumber | BigNumberData>){
  // },
  // heap(){

  // },
  // shaker(){

  // },
  // shell(){

  // },
  // counting(){

  // },
  // binaryinsetion(){

  // },
  // interchange(){

  // },
}

class BigNumber{

  private _value: BigNumberData = '';

  private _integer: string = '';

  private _decimal: string = '';

  private _options: BigNumberFormatOptions = {};

  private _nevigate: boolean = false;

  static MAX_INTEGER = Number.MAX_SAFE_INTEGER;

  static MIN_INTEGER = Number.MIN_SAFE_INTEGER;

  static MAX_VALUE = Number.MAX_VALUE;

  static MIN_VALUE = Number.MIN_VALUE;

  constructor(value?: BigNumberData, options?: BigNumberFormatOptions){
    this._options = options ?? {};

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

    [ this._integer, this._decimal ] = this._value.toString().split('.');
    if (this._decimal === undefined) this._decimal = '';
    
    this._nevigate = this._integer.startsWith('-');
    this._integer = this._integer.replace(/^-/, '').replace(/^0+/, '0')
  }

  get value(){
    return this._value;
  }

  get int(){
    return this._integer;
  }

  get dec(){
    return this._decimal;
  }

  get negative(){
    return this._nevigate;
  }

  get isDecimal(){
    return !!this._decimal.length;
  }

  get empty(){
    return this._value === '';
  }

  get formatValue(){
    return this.format();
  }

  sameSign(big: BigNumber){
    return (this.negative && big.negative) || (!this.negative && big.negative);
  }

  eq(big: BigNumber){
    return aEqualB(this.toString(), big.toString());
  }

  lt(big: BigNumber){
    return aLessThanB(this.toString(), big.toString());
  }

  lte(big: BigNumber){
    return aLessThanOrEqualB(this.toString(), big.toString())
  }

  gt(big: BigNumber){
    return aGreaterThanB(this.toString(), big.toString())
  }

  gte(big: BigNumber){
    return aGreaterThanOrEqualB(this.toString(), big.toString());
  }

  abs(){
    return BigNumber.from(this.value.toString().replace('-', ''), this._options);
  }

  add(...bigs: Array<BigNumber>){
    let rs = this.toString();
    bigs.forEach(big => rs = add(rs, big.toString()));
    return BigNumber.from(rs, this._options);
  }

  sub(...bigs: Array<BigNumber>){
    let rs = this.toString();
    
    bigs.forEach(big => {
      if (big.negative){
        rs = add(rs, big.abs().toString());
      }
      else{
        rs = add(rs, '-' + big.toString());
      }
    });

    return BigNumber.from(rs, this._options);
  }

  mul(){

  }

  div(big: BigNumber): BigNumber{
    return this;
  }

  floor(){
    return BigNumber.from((this.negative ? '-' : '') + this.int, this._options);
  }

  ceil(){
    const val = BigNumber.from(this.int);
    return BigNumber.from(
      (this.negative ? '-' : '') +
      (this.dec === '' ? val : val.add(BigNumber.from(1))),
      this._options
    )
  }

  round(){
    const up = parseInt(this.dec[0] ?? '0') >= 5;
    return up ? this.ceil() : this.floor();
  }

  toString(){
    return this._value.toString();
  }

  format(options?: BigNumberFormatOptions){
    const _options = options ?? this._options;
    const value = BigNumber.format(this._value, { ..._options, comma: false });

    if (!_options?.comma) return value;
    return value.replace('.', '_').replace(/,/g, '.').replace('_', ',');
  }

  revert(value: string){
    return BigNumber.revert(value, this._options);
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

  static from(value: BigNumber | BigNumberData, options?: BigNumberFormatOptions){
    if (value instanceof BigNumber) return new this(value.toString(), options);
    return new this(value, options);
  }

  static format(value: BigNumberData, options?: BigNumberFormatOptions){
    const _value = this.from(value, options).toString();
    if (!_value) return _value;

    const arr = _value.split('.');
    const existDec = arr.length > 1;

    const [ _int, _dec = '' ] = arr;
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

  static revert(value: string, options?: BigNumberFormatOptions){
    if (!this.isMatch(value)) return '';
    if (options?.comma && this.isComma(value)) return this.revertComma(value);
    if (this.isFormat(value)) return this.revertFormat(value);
    if (this.isComma(value)) return this.revertComma(value);
    return value;
  }

  static revertFormat(value: string){
    value = value.trim();
    if (!this.isFormat(value)) return NaN;
    return value.replace(/,/g, '');
  }

  static revertComma(value: string){
    value = value.trim();
    if (!this.isComma(value)) return NaN;
    return value.replace(/\./g, '').replace(',', '.');
  }

  static match(value: BigNumberData){
    const match = value.toString().match(/^-?(\d*\.?)\d*/);
    return match ? match[0] : '';
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

  static sort(bigs: Array<BigNumber>, algorithm: keyof typeof SORT = 'bubble'){
    if (bigs.length < 2) return bigs;
    return SORT[algorithm](bigs);
  }

  static min(big: BigNumber, ...bigs: Array<BigNumber>){
    return this.sort([big, ...bigs])[0];
  }

  static max(big: BigNumber, ...bigs: Array<BigNumber>){
    return this.sort([big, ...bigs]).pop() as BigNumber;
  }

}

export default BigNumber;