import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon/Icon.jsx';

import './SqrButton.pcss';

const SqrButton = ({
  id,
  className,
  size,
  theme,
  icon,
  iconSize,
  disabled,
  onClick,
  href,
  target,
  title,
}) => {
  const componentClassName = classNames('sqr-button', className, {
    'sqr-button_size_l': size === 'l',
    'sqr-button_size_m': size === 'm',
    'sqr-button_size_s': size === 's',
    'sqr-button_size_xs': size === 'xs',
    'sqr-button_dark': theme === 'dark',
    'sqr-button_blue': theme === 'blue',
    'sqr-button_opacity': theme === 'opacity',
    'sqr-button_rating': theme === 'rating',
    'sqr-button_link': href,
  });

  if (href) {
    return (
      <a id={id} href={href} target={target} title={title} className={componentClassName}>
        <Icon
          className="sqr-button__icon"
          type={icon}
          width={iconSize ? iconSize : '16'}
          height={iconSize ? iconSize : '16'}
        />
      </a>
    );
  }
  return (
    <button
      id={id}
      className={componentClassName}
      disabled={disabled}
      title={title}
      onClick={e => {
        e.preventDefault();
        if (typeof onClick == 'function') {
          onClick();
        }
      }}>
      <Icon
        className="sqr-button__icon"
        type={icon}
        width={iconSize ? iconSize : '16'}
        height={iconSize ? iconSize : '16'}
      />
    </button>
  );
};

SqrButton.defaultProps = {
  disabled: false,
};

SqrButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  theme: PropTypes.oneOf(['dark', 'opacity', 'rating', 'blue']),
  icon: PropTypes.string,
  iconSize: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SqrButton;
