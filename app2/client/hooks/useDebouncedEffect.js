import React from 'react';

/**
 * Indempotent operation in the `timeout` window. Ensure that `side_effect` is
 * run at most once in `timeout`.
 *
 * @param {any} input
 * @param {number} timeout
 * @param {Function} side_effect
 */
function useDebouncedEffect(timeout, side_effect, dependencies) {
  React.useEffect(() => {
    const handler = setTimeout(() => {
      side_effect();
    }, timeout);

    return function cleanup() {
      clearTimeout(handler);
    };
  }, [...dependencies, timeout]);
}

export { useDebouncedEffect };
