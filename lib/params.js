'use strict';
let _ = require('lodash');
let objnest = require('objnest');

/**
 * params will be a collection of nested object assignments, such as:
 *
 *  input.glob.body.aggs.device.aggs.plays.date_histogram.extended_bounds.min=2015-12-11
 *
 * We first split this into a target and source:
 *
 *  target: input.glob.body.aggs.device.aggs.plays.date_histogram.extended_bounds.min
 *  source: 2015-12-11
 *
 * Then we use the target value to generate a structured object with source as
 * its value:
 *
 *  {
 *    input: {
 *      glob: {
 *        body: {
 *          ...snip...
 *            extended_bounds: {
 *              min: '2015-12-11'
 *            }
 *          ...snip...
 *        }
 *      }
 *    }
 *  }
 */

module.exports = (_defaults, _params, escapeSequence) => {
  let defaults = _.cloneDeep(_defaults);
  let params = _.cloneDeep(_params);

  if (!Array.isArray(params)) {
    params = [params];
  }

  let m = params.map(param => {
    if (typeof(param) !== 'string') {
      return param;
    }

    let assignment = param.split('=');

    if (assignment.length !== 2) {
      return param;
    }

    /**
     * If the value to be assigned is a number then convert from a string:
     */

    let v = Number(assignment[1]);

    if (String(assignment[1]) === String(v)) {
      assignment[1] = v;
    }

    return mapKeys(
      objnest.expand({
        [assignment[0]]: assignment[1]
      }),
      escapeSequence || '___',
      '.'
    )
    ;
  });

  let ret = defaults;

  m.forEach(mDash => {
    ret = _.merge(ret, mDash);
  });

  return ret;
};

let mapKeys = (obj, substr, newSubstr) => {
  Object.keys(obj).forEach(property => {

    /**
     * Rename the property as requested:
     */

    let newProperty = property.replace(RegExp(substr, 'g'), newSubstr);

    /**
     * If the rename worked then use the new name:
     */

    if (newProperty !== property) {
      obj[newProperty] = obj[property];
      delete obj[property];
      property = newProperty;
    }

    /**
     * Recurse, if necessary:
     */

    if (typeof obj[property] === 'object') {
      obj[property] = mapKeys(obj[property], substr, newSubstr);
    }
  });
  return obj;
}
