import Perfume from 'perfume.js';

const bucket = {}
const analyticsTool = {
  collectGroup: (type, keys) => {
    if (isContains(bucket, keys)) {
      const data = {}
      keys.forEach((k) => {
        data[k] = bucket[k]
        delete bucket[k]
      })
      analyticsTool.track({
        [type]: trans(data, 3),
      })
    }
  },
  collectResource: (type, data) => {
    if (type === data['initiatorType']) {
      const name = data['name']
      const duration = data['duration']
      analyticsTool.track({
        [type]: {
          name,
          duration: trans(duration, 3),
        }
      })
    }
  },
  track: (...args) => {
    console.warn('track: ', ...args)
  }
}

const perfume = new Perfume({
  resourceTiming: true,
  analyticsTracker: (options) => {
    const { metricName, data } = options;
    bucket[metricName] = data
    analyticsTool.collectGroup('p1', [ 'ttfb', 'fp', 'fcp', ])
    analyticsTool.collectGroup('p2', [ 'fid', 'lcp', 'cls', ])

    if (metricName === 'resourceTiming') {
      analyticsTool.collectResource('script', data)
      analyticsTool.collectResource('xmlhttprequest', data)
    }
  },
});


function isContains(bucket, keys) {
  const bKeys = Object.keys(bucket)
  return keys.every((k) => bKeys.includes(k))
}

function trans(num, digit) {
  if (isNaN(num)) return 0
  return +num.toFixed(digit)
}

export default perfume
