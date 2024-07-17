import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';

const CustomActivitiesStudent = () => {

    //use state hooks to store relevant values
    const [yourActivitiesData, setYourActivitiesData] = useState({});
    const [open, setOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState(null);
    const [loadingIdDelete, setLoadingIdDelete] = useState(null)

    const navigate = useNavigate();
    const UserId = sessionStorage.getItem("UserId");

    useEffect(() => {

        //returns list of all activities with corresponding user id
        axios.post("http://20.6.129.171:8080/home", { UserId: UserId }).then((response) => {
            if (response.data) {
                Object.entries(response.data).forEach(([key, value]) => {
                    (async () => {
                        //returns data of activity one with corresponding activity one id. 
                        await axios.get(`http://20.6.129.171:8080/activityone/byId/${parseInt(value.ActivityOneId)}`).then((response) => {
                            if (response.data) {
                                setYourActivitiesData((prevValues) => ({
                                    ...prevValues,
                                    [value.id]: {
                                        ...value,
                                        ["activityTitle"]: response.data.transcript_source_id,
                                    }
                                }));
                            }
                        })
                    })()
                })
            }
        })
    }, [])

    //stores metadata linked to activities
    const storeActivityDetails = (value) => {
        sessionStorage.setItem("ActivitiesId", value.id);
        sessionStorage.setItem("ActivityOneId", value.ActivityOneId);
        sessionStorage.setItem("ActivityTwoId", value.ActivityTwoId);
        sessionStorage.setItem("ActivityThreeId", value.ActivityThreeId);
        sessionStorage.setItem("ActivityFourId", value.ActivityFourId);
        sessionStorage.setItem("ActivityFiveId", value.ActivityFiveId);
        sessionStorage.setItem("ActivitySixId", value.ActivitySixId);
        sessionStorage.setItem("new-chain", false);
    }

    //handles activity navigation
    const handleNavigate = (activityId, activityNumber, value) => {
        storeActivityDetails(value);
        navigate(`/activity${activityNumber}/${activityId}`);
    };

    //handles deletion of templates
    const handleDelete = async (value) => {

        setLoadingIdDelete(value.id)

        try {

            //removes chain of activities in activities table
            await axios.post("http://20.6.129.171:8080/home/delete-activity", { activityId: value.id })

            //deletes activity one id
            await axios.post("http://20.6.129.171:8080/activityone/delete-activity", { activityId: value.ActivityOneId })

            //deletes activity two id
            if (value.ActivityTwoId) {
                await axios.post("http://20.6.129.171:8080/activitytwo/delete-activity", { activityId: value.ActivityTwoId })
            }

            //deletes activity three id
            if (value.ActivityThreeId) {
                await axios.post("http://20.6.129.171:8080/activitythree/delete-activity", { activityId: value.ActivityThreeId })
            }

            //deletes activity four id
            if (value.ActivityFourId) {
                await axios.post("http://20.6.129.171:8080/activityfour/delete-activity", { activityId: value.ActivityFourId })
            }

            //deletes activity five id
            if (value.ActivityFiveId) {
                await axios.post("http://20.6.129.171:8080/activityfive/delete-activity", { activityId: value.ActivityFiveId })
            }

            //deletes activity six id
            if (value.ActivitySixId) {
                await axios.post("http://20.6.129.171:8080/activitysix/delete-activity", { activityId: value.ActivitySixId })
            }

            setLoadingIdDelete(null);

            setYourActivitiesData(prevActivities => {
                const updatedActivities = { ...prevActivities };
                delete updatedActivities[value.id];
                return updatedActivities;
            });

        } catch (error) {

            console.error('Failed to update template:', error);
            setLoadingIdDelete(null);

        }

    }

    //dialog for confirming user action for deleting a template
    const confirmDeleteDialog = () => {
        return (
            <Dialog open={open} onClose={() => setOpen(false)}
                BackdropProps={{
                    style: {
                        opacity: "10%"
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: 'none',

                    },
                }}>
                <DialogTitle className='dialog-delete-header'>
                    <Typography className='dialog-delete-title'><strong>Are you sure?</strong></Typography>
                    <Typography>Once deleted, retrieval is impossible. Please consult your instructor before proceeding.</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} >
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        if (deleteItem) handleDelete(deleteItem);
                        setOpen(false);
                        setDeleteItem(null);
                    }} autoFocus>
                        Proceed
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <div className='custom-activities-container'>

            <Typography className="custom-activities-title">
                Your Custom Activities
            </Typography>

            {/*displays the set of user activities along with their title title*/}
            {/*if student has created no activities*/}
            {Object.entries(yourActivitiesData).length === 0 ? (
                <div className='custom-activities-blank'>
                    Currently, no templates are selected. Please choose one from the list below.
                </div>
            ) : (
                Object.entries(yourActivitiesData).map(([key, value]) => {
                    return (
                        <div className='custom-activities'>
                            <div className='activity-container'>
                                <Typography className="activity-title">
                                    {value.activityTitle === "" ? "No Title Provided" : value.activityTitle}
                                </Typography>
                            </div>

                            <div className="activity-buttons">

                                {/*activity one*/}
                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityOneId, "one", value) }}
                                    className={`activity-button ${value.ActivityOneId ? "active" : "disabled"}`}>
                                    One
                                </Button>

                                {/*activity two*/}
                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityTwoId, "two", value) }}
                                    disabled={!value.ActivityTwoId}
                                    className={`activity-button ${value.ActivityTwoId ? "active" : "disabled"}`}>
                                    Two
                                </Button>

                                {/*activity three*/}
                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityThreeId, "three", value) }}
                                    disabled={!value.ActivityThreeId}
                                    className={`activity-button ${value.ActivityThreeId ? "active" : "disabled"}`}>
                                    Three
                                </Button>

                                {/*activity four*/}
                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityFourId, "four", value) }}
                                    disabled={!value.ActivityFourId}
                                    className={`activity-button ${value.ActivityFourId ? "active" : "disabled"}`}>
                                    Four
                                </Button>

                                {/*activity five*/}
                                <Button disableRipple onClick={() => { handleNavigate(value.ActivityFiveId, "five", value) }}
                                    disabled={!value.ActivityFiveId}
                                    className={`activity-button ${value.ActivityFiveId ? "active" : "disabled"}`}>
                                    Five
                                </Button>

                                {/*activity six*/}
                                <Button disableRipple onClick={() => { handleNavigate(value.ActivitySixId, "six", value) }}
                                    disabled={!value.ActivitySixId}
                                    className={`activity-button ${value.ActivitySixId ? "active" : "disabled"}`}>
                                    Six
                                </Button>
                                
                                {loadingIdDelete === value.id ? (
                                    <CircularProgress size={37} className='delete-template-loading' />
                                ) : (
                                    <Button disableRipple onClick={() => { setOpen(true); setDeleteItem(value); }} className='activity-button-delete'>
                                        <ClearIcon />
                                    </Button>
                                )}
                                {confirmDeleteDialog()}
                            </div>
                        </div>
                    )
                })
            )}



        </div>
    )
}

export default CustomActivitiesStudent