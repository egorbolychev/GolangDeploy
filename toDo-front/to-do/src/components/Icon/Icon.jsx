import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './IconSvg';

import './Icon.pcss';

const Icon = ({ id, className, type, width, height, onClick }) => {
  const componentClassName = classNames('icon', className);

  return (
    <svg onClick={onClick} id={id} className={componentClassName} height={height} width={width}>
      <use xlinkHref={`#${type}`} />
    </svg>
  );
};

Icon.defaultProps = {
  width: '24',
  height: '24',
};

Icon.propTypes = {
  /** Id */
  id: PropTypes.string,

  /** Дополнительный класс */
  className: PropTypes.string,

  /** Тип - имя иконки */
  type: PropTypes.string,

  /** Ширина */
  width: PropTypes.string,

  /** Высота */
  height: PropTypes.string,

  /** Обработчик клика */
  onClick: PropTypes.func,
};

export default Icon;
