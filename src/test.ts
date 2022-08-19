import {
  minusAGreaterThanBPositive,
  minusAGreaterThanBNegative,
  minusALessThanBPositive,
  minusALessThanBNegative,
  addABPositive,
  addABNegative,
  aEqualB,
  aLessThanB
} from "./utils";

console.log(
  'minusAGreaterThanBPositive',
  minusAGreaterThanBPositive(
    '123456789123456789.1234', 
    '12345678912345678.123456789'
  )
);

console.log(
  'minusAGreaterThanBNegative',
  minusAGreaterThanBNegative(
    '-12345678912345678.123456789',
    '-123456789123456789.1234'
  )
);

console.log(
  'minusALessThanBPositive',
  minusALessThanBPositive(
    '12345678912345678.123456789',
    '123456789123456789.1234'
  )
);

console.log(
  'minusALessThanBNegative',
  minusALessThanBNegative(
    '-123456789123456789.1234',
    '-12345678912345678.123456789',
  )
);

console.log(
  'addABPositive',
  addABPositive(
    '123456789123456789.1234', 
    '12345678912345678.123456789'
  )
);

console.log(
  'addABNegative',
  addABNegative(
    '-123456789123456789.1234', 
    '-12345678912345678.123456789'
  )
);

console.log(
  'aEqualB',
  aEqualB(
    '123456789123456789.1234', 
    '123456789123456789.1234', 
  )
);

console.log(
  'aLessThanB',
  aLessThanB(
    '12345678912345678.1234', 
    '123456789123456789.1234', 
  )
);