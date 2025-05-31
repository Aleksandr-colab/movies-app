import React from 'react';
import { Tabs } from 'antd';
import './Header.css';
import PropTypes from 'prop-types';

const Header = ({ changeTab }) => {
  const items = [
    {
      key: '1',
      label: 'Поиск',
      children: null,
    },
    {
      key: '2',
      label: 'Избранные',
      children: null,
    },
  ];

  return (
    <div className="header">
      <Tabs defaultActiveKey="1" onChange={changeTab} items={items} />
    </div>
  );
};

Header.defaultProps = {
  changeTab: () => {},
};

Header.propTypes = {
  changeTab: PropTypes.func.isRequired,
};

export default Header;