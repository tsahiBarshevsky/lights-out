import React from 'react';
import { Button, Typography } from '@mui/material';
import { IoTicketOutline } from 'react-icons/io5';
import { GiTheater } from 'react-icons/gi';
import { BiCameraMovie } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md'
import { auth } from '../../services/firebase';
import './styles.sass';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = ['movies', 'halls', 'screenings'];

    const onSignOut = async () => {
        await auth.signOut();
    }

    const renderIcon = (tab) => {
        switch (tab) {
            case 'movies':
                return (
                    <IoTicketOutline
                        size={20}
                        className={activeTab === tab ? "icon icon-active" : "icon"}
                    />
                );
            case 'halls':
                return (
                    <GiTheater
                        size={17}
                        className={activeTab === tab ? "icon icon-active" : "icon"}
                    />
                );
            case 'screenings':
                return (
                    <BiCameraMovie
                        size={20}
                        className={activeTab === tab ? "icon icon-active" : "icon"}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="sidebar-container">
            <Typography variant='h4' className='logo'>Lights Out</Typography>
            <Typography variant='subtitle1' className='subtitle'>Admin Panel</Typography>
            <div className="tabs">
                {tabs.map((tab) => {
                    return (
                        <Button
                            disableFocusRipple
                            disableRipple
                            className="button"
                            onClick={() => setActiveTab(tab)}
                            key={tab}
                        >
                            <div className={activeTab === tab ? "side-mark side-mark-active" : "side-mark"} />
                            <div className="content">
                                <div className="icon-wrapper">
                                    {renderIcon(tab)}
                                </div>
                                <Typography
                                    className={activeTab === tab ? "caption caption-active" : "caption"}
                                    variant='subtitle1'
                                >
                                    {tab}
                                </Typography>
                            </div>
                        </Button>
                    )
                })}
                <Button
                    disableFocusRipple
                    disableRipple
                    className="button"
                    onClick={onSignOut}
                >
                    <div className="side-mark" />
                    <div className="content">
                        <div className="icon-wrapper">
                            <MdLogout size={20} className="icon" />
                        </div>
                        <Typography
                            className="caption"
                            variant='subtitle1'
                        >
                            Sign Out
                        </Typography>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default Sidebar;