import React, { useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClass } from '../redux/actions/adminAction';

// Function to prepare nav items based on fetched data
const prepareNavItems = (classes) => {
  return [
    {
      component: CNavGroup,
      name: 'Điểm',
      to: '/diem',
      icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
      items: classes.map((classItem) => ({
        component: CNavItem,
        name: classItem.tenLop,
        to: `/diem/${classItem.id}`,
      })),
    },
    // Add other nav items as needed
  ];
};

const NavComponent = () => {
  const dispatch = useDispatch();
  const allClasses = useSelector((state) => state.admin.allClasss) || [];

  useEffect(() => {
    dispatch(getAllClass());
  }, [dispatch]);

  const navItems = prepareNavItems(allClasses);

  return (
    <>
      {/* Your Nav structure */}
      {navItems.map((navItem, index) => (
        <navItem.component key={index} {...navItem} />
      ))}
    </>
  );
};

export default NavComponent;
