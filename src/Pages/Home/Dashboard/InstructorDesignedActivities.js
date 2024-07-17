import { Alert, Button, CircularProgress, LinearProgress, Typography } from '@mui/material'
import './Dashboard.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

const InstructorDesignedActivities = () => {

    const [listOfActivities, setListOfActivities] = useState({})
    const [loadingId, setLoadingId] = useState(null)

    useEffect(() => {
        //returns a list of all instructors
        axios.get("http://20.6.129.171:8080/home/instructors").then((response) => {
            if (response.data) {
                Object.entries(response.data).forEach(([key, value]) => {
                    (async () => {
                        //for each instructor retrieves a list of activities created by them.
                        await axios.post("http://20.6.129.171:8080/home", { UserId: parseInt(value.id) }).then((response) => {
                            if (response.data) {
                                Object.entries(response.data).forEach(([key2, value2]) => {
                                    //checks if they are published
                                    if (value2.Published !== false) {
                                        (async () => {
                                            //returns corresponding activity one data
                                            await axios.get(`http://20.6.129.171:8080/activityone/byId/${parseInt(value2.ActivityOneId)}`).then((response) => {
                                                if (response.data) {
                                                    setListOfActivities((prevValues) => ({
                                                        ...prevValues,
                                                        [value2.id]: {
                                                            ...value2,
                                                            ["username"]: value.username,
                                                            ["activityTitle"]: response.data.transcript_source_id,
                                                        }
                                                    }));
                                                }
                                            })
                                        })()
                                    }
                                })

                            }
                        })
                    })();
                })
            }
        })
    }, [])

    //retrieves data from the original set of activities and creates a copy
    //this is done so that the original copy can only be altered by the instructor
    const handleCopyTemplate = async (data) => {

        setLoadingId(data.id);

        try {

            let ActivitiesID;
            let Activity1Id;
            let Activity2Id;
            let Activity3Id;
            let Activity4Id;
            let Activity5Id;
            let Activity6Id;

            //checks if activity one id is present
            if (data.ActivityOneId) {

                //retrives corresponding activity one data
                const response = await axios.get(`http://20.6.129.171:8080/activityone/byId/${data.ActivityOneId}`);

                const ActivityOneData = response.data;
                delete ActivityOneData["id"];
                delete ActivityOneData["createdAt"];
                delete ActivityOneData["updatedAt"];

                if (ActivityOneData !== null) {
                    let data = {
                        id: sessionStorage.getItem("UserId"),
                        content: ActivityOneData
                    };

                    //creates a new chain of activities and a copy of activity one
                    const ActivityOneIdResponse = await axios.post("http://20.6.129.171:8080/activityone/fromtemplate", data);
                    ActivitiesID = ActivityOneIdResponse.data.ActivitiesId.id;
                    Activity1Id = ActivityOneIdResponse.data.ActivityOneId;
                    sessionStorage.setItem("ActivitiesId", ActivitiesID);
                    sessionStorage.setItem("ActivityOneId", Activity1Id);
                }
            }

            //checks if activity two id is present
            if (data.ActivityTwoId) {

                //retrives corresponding activity two data
                const response2 = await axios.get(`http://20.6.129.171:8080/activitytwo/byId/${data.ActivityTwoId}`);
                const ActivityTwoData = response2.data;
                delete ActivityTwoData["id"];
                delete ActivityTwoData["createdAt"];
                delete ActivityTwoData["updatedAt"];

                if (ActivityTwoData !== null) {
                    let data = {
                        id: sessionStorage.getItem("ActivitiesId"),
                        content: ActivityTwoData,
                    };

                    //updates the new chain of activities and creates a copy of activity two
                    const ActivityTwoIdResponse = await axios.post("http://20.6.129.171:8080/activitytwo", data);
                    Activity2Id = ActivityTwoIdResponse.data.id;
                    sessionStorage.setItem("ActivityTwoId", Activity2Id);
                }
            }

            //checks if activity three id is present
            if (data.ActivityThreeId) {

                //retrives corresponding activity three data
                const response3 = await axios.get(`http://20.6.129.171:8080/activitythree/byId/${data.ActivityThreeId}`);
                const ActivityThreeData = response3.data;
                delete ActivityThreeData["id"];
                delete ActivityThreeData["createdAt"];
                delete ActivityThreeData["updatedAt"];

                if (ActivityThreeData !== null) {
                    let data = {
                        id: sessionStorage.getItem("ActivitiesId"),
                        content: ActivityThreeData,
                    };

                    //updates the new chain of activities and creates a copy of activity three
                    const ActivityThreeIdResponse = await axios.post("http://20.6.129.171:8080/activitythree", data);
                    Activity3Id = ActivityThreeIdResponse.data.id;
                    sessionStorage.setItem("ActivityThreeId", Activity3Id);
                }
            }

            //checks if activity four id is present
            if (data.ActivityFourId) {

                //retrives corresponding activity four data
                const response4 = await axios.get(`http://20.6.129.171:8080/activityfour/byId/${data.ActivityFourId}`);
                const ActivityFourData = response4.data;
                delete ActivityFourData["id"];
                delete ActivityFourData["createdAt"];
                delete ActivityFourData["updatedAt"];

                if (ActivityFourData !== null) {
                    let data = {
                        id: sessionStorage.getItem("ActivitiesId"),
                        content: ActivityFourData,
                    };

                    //updates the new chain of activities and creates a copy of activity four
                    const ActivityFourIdResponse = await axios.post("http://20.6.129.171:8080/activityfour", data);
                    Activity4Id = ActivityFourIdResponse.data.id;
                    sessionStorage.setItem("ActivityFourId", Activity4Id);
                }
            }

            //checks if activity five id is present
            if (data.ActivityFiveId) {

                //retrives corresponding activity five data
                const response5 = await axios.get(`http://20.6.129.171:8080/activityfive/byId/${data.ActivityFiveId}`);
                const ActivityFiveData = response5.data;
                delete ActivityFiveData["id"];
                delete ActivityFiveData["createdAt"];
                delete ActivityFiveData["updatedAt"];

                if (ActivityFiveData !== null) {
                    let data = {
                        id: sessionStorage.getItem("ActivitiesId"),
                        content: ActivityFiveData,
                    };

                    //updates the new chain of activities and creates a copy of activity five
                    const ActivityFiveIdResponse = await axios.post("http://20.6.129.171:8080/activityfive", data);
                    Activity5Id = ActivityFiveIdResponse.data.id;
                    sessionStorage.setItem("ActivityFiveId", Activity5Id);
                }
            }

            //checks if activity six id is present
            if (data.ActivitySixId) {

                //retrives corresponding activity six data
                const response6 = await axios.get(`http://20.6.129.171:8080/activitysix/byId/${data.ActivitySixId}`);
                const ActivitySixData = response6.data;
                delete ActivitySixData["id"];
                delete ActivitySixData["createdAt"];
                delete ActivitySixData["updatedAt"];

                if (ActivitySixData !== null) {
                    let data = {
                        id: sessionStorage.getItem("ActivitiesId"),
                        content: ActivitySixData,
                    };

                    //updates the new chain of activities and creates a copy of activity six
                    const ActivitySixIdResponse = await axios.post("http://20.6.129.171:8080/activitysix", data);
                    Activity6Id = ActivitySixIdResponse.data.id;
                    sessionStorage.setItem("ActivityFourId", Activity6Id);
                }
            }

            let activityIds = [Activity1Id, Activity2Id, Activity3Id, Activity4Id, Activity5Id, Activity6Id]

            for (let i = 1; i <= 6; i++) {
                let logs_data = {
                    StudentId: sessionStorage.getItem("UserId"),
                    Event: "Create",
                    DateTime: Date.now(),
                    StudentTemplateId: ActivitiesID,
                    ActivityType: `Activity ${i}`,
                    ActivityId: activityIds[i - 1],
                };

                //updates student logs 
                await axios.post(`http://20.6.129.171:8080/studentlog/create`, logs_data);
            }

            setLoadingId(null);
            window.location.reload(false);

        } catch (error) {

            console.error('Failed to copy template:', error);
            setLoadingId(null);
        }
    }

    return (
        <div className='custom-activities-container'>

            <Typography className="custom-activities-title">
                Instructor-Designed Activity Templates
            </Typography>

            <Alert className="alert-warning" severity="warning">
                Please do not refresh the page while the template is being copied. The page will refresh automatically once the duplication of activities is complete.
            </Alert>

            {/*displays the set of instructor activities available for students to work on*/}
            {/*If no templates have been published by the instructor*/}
            {Object.entries(listOfActivities).length === 0 ? (
                <div className='custom-activities-blank'>
                    Currently, no templates are available. Please consult your instructor.
                </div>
            ) : (
                Object.entries(listOfActivities).map(([key, value]) => {
                    return (
                        <div key={key} className="other-activities">
                            <div className='activity-container'>

                                {/*checks for the presence of a title*/}
                                <Typography className="activity-title">
                                    {value.activityTitle === "" ? "No Title Provided" : value.activityTitle}
                                </Typography>

                                <Typography className='activity-author'>
                                    ({value.username})
                                </Typography>

                            </div>

                            {loadingId === value.id ? (
                                <CircularProgress size={37} className='copy-template-loading' />
                            ) : (
                                <Button disableRipple className="copy-template-button" onClick={() => handleCopyTemplate(value)}>
                                    Launch
                                </Button>
                            )}
                            
                        </div>
                    )
                })
            )}

        </div>
    )

}

export default InstructorDesignedActivities