import 'intersection-observer';

const options = {
  root: null,
  rootMargin: '0px',
  threshold: [0, 0.5, 1]
};

function getParams(el) {
  const { exposureTrackerAction, exposureTrackerParams } = el.dataset;

  const Key = exposureTrackerAction;

  const pageEl = document.querySelector('[data-exposure-tracker-page-params]');
  let pageParams;
  if (pageEl?.dataset?.exposureTrackerPageParams) {
    try {
      pageParams = JSON.parse(pageEl?.dataset?.exposureTrackerPageParams);
    } catch (error) {
      console.error('parse pageParams fail');
    }
  }

  let params;
  if (exposureTrackerParams) {
    try {
      params = JSON.parse(exposureTrackerParams);
    } catch (error) {
      console.error('parse params fail');
    }
  }

  return {
    Key,
    ...pageParams,
    ...params
  };
}

function handleLog(entry) {
  const params = getParams(entry.target);
  console.info('exposure tracker! log here', params);
  entry.target.dataset.exposureTrackerExposed = '1';
}

function callback(entries, observer) {
  entries.forEach(entry => {
    // console.log(entry.intersectionRatio);
    if (
      entry.target.dataset.exposureTrackerExposed !== '1' &&
      entry.intersectionRatio >= 0.5
    ) {
      const { requestIdleCallback } = window;
      requestIdleCallback(() => {
        handleLog(entry);
      });
    } else if (entry.intersectionRatio === 0) {
      delete entry.target.dataset.exposureTrackerExposed;
    }
  });
}

const intersectionObserver = new IntersectionObserver(callback, options);

export default intersectionObserver;

export function collectTargets() {
  const els = Array.from(
    document.querySelectorAll('[data-exposure-tracker-action]')
  ).filter(el => !el.dataset.exposureTrackerTracked);

  if (els.length > 0) {
    // console.log('collectTargets', els);

    els.forEach(el => {
      intersectionObserver.observe(el);
      el.dataset.exposureTrackerTracked = '1';
    });
  }
}
