import React from 'react';
import classNames from 'classnames';

import './RangeDateCount.pcss';

const RangeDateCount = ({ className, text, isTopRightPos }) => {
  const componentClassName = classNames('range-date-count', className, {
    'range-date-count_top-right': isTopRightPos,
  });

  return <div className={componentClassName}>{text}</div>;
};

export default RangeDateCount;
