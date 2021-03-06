'use strict';
let _ = require('lodash');
let evaljson = require('evaljson');

let filters = {
  csv: fnCaller(require('./csv')),
  geoip: fnCaller(require('./geoip')),
  geocode: fnCaller(require('./geocode')),
  geohash: fnCaller(require('./geohash')),
  generate: fnCaller(require('./generate')),
  iso3166: fnCaller(require('./iso3166')),
  javascript: fnCaller(require('./javascript')),
  json: fnCaller(require('./json')),
  moment: fnCaller(require('./moment')),
  mysql: fnCaller(require('./mysql')),
  mutate: fnCaller(require('./mutate')),
  paginate: fnCaller(require('./paginate')),
  request: fnCaller(require('./request')),
  select: fnCaller(require('./select')),
  sum: fnCaller(require('./sum')),
  urldecode: fnCaller(require('./urldecode')),
  weather: require('./weather')
};
let checkForSimpleAssignment = require('./../checkForSimpleAssignment');

function fnCaller(fn) {
  return (params, data) => {
    try {
      var condition;

      if (!params.if) {
        condition = true;
      } else {
        condition = checkForSimpleAssignment(data, params.if);

        if (condition === null) {
          condition = evaljson(params, data).if;
        }
      }

      if (!!condition) {
        return fn(params, data || {});
      } else {
        return data;
      }
    } catch (e) {
      throw(new Error('Unable to process filter: ' + e));
    }
  }
}

module.exports = function(wrapper) {
  return _.fromPairs(
    Object.getOwnPropertyNames(filters)
    .map(filter => {
      return [
        filter,
        (wrapper)
          ? (params, data) => wrapper(params, data, filters[filter])
          : filters[filter]
      ];
    })
  );
}
