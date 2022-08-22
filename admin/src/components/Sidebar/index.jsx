import React from 'react';
import { Button, Typography } from '@mui/material';
import { IoTicketOutline } from 'react-icons/io5';
import { GiTheater } from 'react-icons/gi';
import { BiCameraMovie } from 'react-icons/bi';
import './styles.sass';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const tabs = ['movies', 'halls', 'screenings'];

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
            </div>



            {/* <Button
                disableFocusRipple
                disableRipple
                className="button"
                >
                <div className={activeTab === 'movies' ? "side-mark side-mark-active" : "side-mark"} />
                <div className="content">
                    <MdLocalMovies
                        size={30}
                        className={activeTab === 'movies' ? "icon icon-active" : "icon"}
                    />
                    <Typography
                        className={activeTab === 'movies' ? "caption caption-active" : "caption"}
                        variant='h6'
                    >
                        Movies
                    </Typography>
                </div>
            </Button>
            <Button
                disableFocusRipple
                disableRipple
                className="button space"
            >
                <div className="content">
                    <GiTheater size={20} />
                    <Typography variant='subtitle1'>
                        Halls
                    </Typography>
                </div>
            </Button>
            <Button
                disableFocusRipple
                disableRipple
                className="button"
            >
                <div className="content">
                    <BsCameraReelsFill size={20} />
                    <Typography variant='subtitle1'>
                        Screenings
                    </Typography>
                </div>
            </Button> */}
        </div>
    )
}

export default Sidebar;