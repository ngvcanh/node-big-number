function isDec(dec: string){
  return dec !== '0' && dec !== '' && dec !== undefined;
}

export function aEqualB(a: string, b: string){
  let [ intA, decA ] = a.split('.'), [ intB, decB ] = b.split('.');
  const aNeg = intA.startsWith('-'), bNeg = intB.startsWith('-');
    
  if ((aNeg && !bNeg) || (!aNeg && bNeg)) return false;

  intA = intA.replace('-', '');
  intB = intB.replace('-', '');

  if (intA.length !== intB.length) return false;

  for (let i = 0; i < intA.length; i++){
    if (parseInt(intA[i]) !== parseInt(intB[i])) return false;
  }

  if (!isDec(decA) && !isDec(decB)) return true;
  if (!isDec(decA) || !isDec(decB)) return false;
  if (decA.length !== decB.length) return false;

  for (let i = 0; i < decA.length; i++){
    if (parseInt(decA[i]) !== parseInt(decB[i])) return false;
  }

  return true;
}

export function aLessThanB(a: string, b: string){
  let [ intA, decA ] = a.split('.'), [ intB, decB ] = b.split('.');
  const aNeg = intA.startsWith('-'), bNeg = intB.startsWith('-');

  if (aNeg && !bNeg) return true;
  if (!aNeg && bNeg) return false;
  
  if (intB.length < intA.length) return aNeg;
  if (intB.length > intA.length) return !aNeg;

  for (let i = 0; i < intA.length; i++){
    if (parseInt(intB[i]) < parseInt(intA[i])) return aNeg;
    if (parseInt(intB[i]) > parseInt(intA[i])) return !aNeg;
  }

  if (!isDec(decB) && !isDec(decA)) return false;
  if (!isDec(decB)) return false;
  if (!isDec(decA)) return true;

  const length = Math.min(decA.length, decB.length);

  for (let i  = 0; i < length; i++){
    if (parseInt(decB[i]) < parseInt(decA[i])) return aNeg;
    if (parseInt(decB[i]) > parseInt(decA[i])) return !aNeg;
  }

  if (decB.length < decA.length) return aNeg;
  if (decB.length > decA.length) return !aNeg;
  
  return false;
}

export function addABPositive(a: string, b: string){
  const [ intA, decA ] = a.split('.'), [ intB, decB ] = b.split('.');
  let dec = '', int = '', surplus = false;

  if (!isDec(decB)){
    dec = decA;
  }
  else if (!isDec(decA)){
    dec = decB;
  }
  else{
    const max = Math.max(decA.length, decB.length);
    
    for (let i = max - 1; i >= 0; i--){
      const charA = parseInt(decA[i] ?? '0'), charB = parseInt(decB[i] ?? '0');
      let char = charA + charB;

      if (surplus){
        char += 1;
        surplus = false;
      }

      if (char > 9){
        char -= 10;
        surplus = true;
      }

      dec = char + dec;
    }
  }

  const aLength = intA.length, bLength = intB.length
  , max = Math.max(aLength, bLength);

  for (let i = 0; i < max; i++){
    const charA = parseInt(intA[aLength - i - 1] ?? '0'), charB = parseInt(intB[bLength - i - 1] ?? '0');
    let char = charA + charB;

    if (surplus){
      char += 1;
      surplus = false;
    }

    if (char > 9){
      char -= 10;
      surplus = true;
    }

    int = char + int;
  }

  if (surplus) int = 1 + int;

  return `${ int }.${ dec }`;
}

export function addABNegative(a: string, b: string){
  return '-' + addABPositive(a.replace('-', ''), b.replace('-', ''));
}

export function addAPositiveBNegative(a: string, b: string){

}

export function minusAGreaterThanBPositive(a: string, b: string){
  let [ intA, decA ] = a.split('.'), [ intB, decB ] = b.split('.')
  , dec = '', int = '', borrow = false;

  if (!isDec(decB)){
    dec = decA;
  }
  else{
    if (decA === undefined) decA = '';
    const max = Math.max(decA.length, decB.length);

    for (let i = max - 1; i >= 0; i--){
      let char1 = parseInt(decA[i] ?? '0'), char2 = parseInt(decB[i] ?? '0');
      
      if (borrow){
        char2 += 1;
        borrow = false;
      }

      if (char1 < char2){
        char1 += 10;
        borrow = true;
      }

      dec = (char1 - char2) + dec;
    }
  }

  const aLength = intA.length, bLength = intB.length;  

  for (let i = 0; i < aLength - 1; i++){
    let char1 = parseInt(intA[aLength - i - 1]), char2 = parseInt(intB[bLength - i - 1] ?? '0');

    if (borrow){
      char2 += 1;
      borrow = false;
    }

    if (char1 < char2){
      char1 += 10;
      borrow = true;
    }

    int = (char1 - char2) + int;
  }

  return `${ int }.${ dec }`;
}

export function minusAGreaterThanBNegative(a: string, b: string){
  return minusAGreaterThanBPositive(b.replace('-', ''), a.replace('-', ''));
}

export function minusALessThanBPositive(a: string, b: string){
  return '-' + minusAGreaterThanBPositive(b, a);
}

export function minusALessThanBNegative(a: string, b: string){
  return '-' + minusAGreaterThanBPositive(a.replace('-', ''), b.replace('-', ''));
}

export function minusAPositiveBNagetive(a: string, b: string){
  return addABPositive(a, b.replace('-', ''));
}

export function minusANegativeBPositive(a: string, b: string){
  return '-' + addABPositive(a.replace('-', ''), b);
}