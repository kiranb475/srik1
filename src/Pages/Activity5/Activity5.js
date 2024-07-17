import './Activity5.css'
import { Box, Button, FormControlLabel, Switch, Tooltip, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getColor } from "../../Components/Colors.js";
import DisplayComponents from "./DisplayComponents.js";
import InfoIcon from '@mui/icons-material/Info';

const Act5 = () => {

    //use state hooks to store relevant values
    const [clustData, setClustData] = useState({});
    const [MLClusters, setMLClusters] = useState(false);
    const [newChain, setNewChain] = useState(false);
    const [alternateView, setAlternateView] = useState(false);
    const [instructor, setInstructor] = useState(false);
    const [blankTemplate, setBlankTemplate] = useState(false);
    const [AIColors, setAIColors] = useState({});
    const [label, setLabel] = useState("Activity 5 Label");
    const [instruction, setInstruction] = useState(`
      <Typography>For this activity, you will see two views of your clusters and labels. In the User view, you will see the arrangement you submitted in the previous activity or the arrangement you are currently working on. In the Alternative view, you will see how the AI model would have clustered the sentences you selected. The Alternative view does not provide labels for the clusters, but you might be able to infer them yourself.</Typography>
      <br />
      <br />
      <Typography>Compare the two arrangement and refine the arrangement in the User view in anyway that you feel improves it. When you are satisfied with the arrangement in the User view, click the Submit button to continue to the next activity.</Typography>`);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        // checks if id passed in the url is null
        if (id === "null") {
            alert("Please go back to the previous activity and submit it to continue.");
            navigate("/")
        }

        // checks occupation of the user
        if (sessionStorage.getItem("Occupation") == "Instructor") {
            setInstructor(true);
        }

        //if valid id exists, fetch data from activity five
        if (id) {
            axios.get(`http://20.6.129.171:8080/activityfive/byId/${id}`)
                .then((response) => {
                    if (response.data !== null) {

                        //enabling machine learning clustering
                        if (response.data.MLClusters) {
                            setMLClusters(response.data.MLClusters);
                        } else {
                            setMLClusters(false);
                        }

                        //label
                        setLabel(response.data.label);

                        //instruction
                        setInstruction(response.data.instruction);

                        //if the activity was last authored by an instructors, gets it data from activity four instead
                        if (response.data.lastAuthored === "instructor") {
                            axios.get(`http://20.6.129.171:8080/activityfour/byId/${sessionStorage.getItem("ActivityFourId")}`)
                                .then((response) => {
                                    if (response.data !== null) {
                                        setClustData(response.data.content);
                                        if (Object.entries(response.data.content).length === 0) {
                                            setBlankTemplate(true)
                                        }

                                    } else {
                                        alert("Before progressing to Activity 5, please complete Activity 4.");
                                    }
                                });
                            //gets data from activity five
                        } else {
                            if (response.data.content && sessionStorage.getItem("new-chain") !== "true") {
                                setClustData(response.data.content);
                                if (Object.entries(response.data.content).length === 0) {
                                    setBlankTemplate(true)
                                }
                            } else {
                                axios.get(`http://20.6.129.171:8080/activityfour/byId/${sessionStorage.getItem("ActivityFourId")}`)
                                    .then((response) => {
                                        if (response.data !== null) {
                                            setClustData(response.data.content);
                                            if (Object.entries(response.data.content).length === 0) {
                                                setBlankTemplate(true)
                                            }
                                        }
                                    });
                            }
                        }

                    }
                });
        } else {
            axios.get(`http://20.6.129.171:8080/activityfour/byId/${sessionStorage.getItem("ActivityFourId")}`)
                .then((response) => {
                    if (response.data !== null) {
                        setClustData(response.data.content);
                        if (Object.entries(response.data.content).length === 0) {
                            setBlankTemplate(true)
                        }

                    } else {
                        alert("Before progressing to Activity 5, please complete Activity 4.");
                    }
                });
        }
    }, []);

    //changes the color of components based on the machine learning clustering
    const createAIClustering = () => {

        let clusters = {};
        if (Object.entries(AIColors).length === 0) {
            clusters = {
                0: getColor(),
                1: getColor(),
                2: getColor(),
                3: getColor(),
                4: getColor(),
            };
            setAIColors(clusters)
        } else {
            clusters = AIColors
        }

        let data = clustData

        Object.entries(data.content).map(([key, value]) => {
            if (value.response_id) {
                Object.entries(value.response_text).map(([key2, value2]) => {
                    if (value2.sentenceAIClassified !== -1 && value2.clusterData) {
                        data.content[key].response_text[key2].clusterData.AIColor = clusters[value2.sentenceAIClassified]
                    }
                });
            }
        });

        setClustData(data)
    };

    //handle double click
    const handleDoubleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top

        createLabelAtPosition(x / 2, y / 2);
    };

    //handle creation of labels when user double clicks
    const createLabelAtPosition = (x, y) => {

        setClustData((prevState) => {
            const newData = {
                ...prevState,
                content: {
                    ...prevState.content,
                    [Object.keys(prevState.content).length + 1]: {
                        id: uuidv4(),
                        clusterLabelA5: "Click to edit label",
                        x: x,
                        y: y,
                        userClusterIndexA5: -1,
                        type: "label",
                        color: getColor(),
                    },
                },
            };
            return newData;
        });
    };

    //checks whether two components are close to each other
    const checkProximity = (x1, y1, x2, y2, height1, height2) => {

        if (Math.abs(x1 - x2) <= 125) {
            if (height1 === 120 && height2 === 120) {
                if (Math.abs(y1 - y2) <= 70) {
                    return true;
                }
            }
            if (height1 === 40 && height2 === 40) {
                if (Math.abs(y1 - y2) <= 60) {
                    return true;
                }
            }
            if (height1 === 40 && height2 === 120) {
                if (Math.abs(y1 - y2) <= 70) {
                    return true;
                }
            }
            if (height1 === 120 && height2 === 40) {
                if (Math.abs(y1 - y2) <= 40) {
                    return true;
                }
            }
        } else {
            return false;
        }
    };

    //clusters relevant components based on their proximity and assigns them colors
    const checkClass = () => {
        let userData = clustData;
        let currentClass = 0;
        let flag = false;
        let flag2 = false;
        let colorsUsedData = {};
        let checkClassData = {};

        //sets all userClusterIndexA5 to -1 irrespective of their initial state
        Object.entries(userData.content).forEach(([key, data]) => {
            if (data.type === "label") {
                data.userClusterIndexA5 = -1;
            } else if (data.response_id) {
                Object.entries(data.response_text).forEach(([key2, data2]) => {
                    if (data2.clusterData) {
                        data2.clusterData.userClusterIndexA5 = -1;
                    }
                });
            }
        });

        //creates an array of relevant components for clustering 
        Object.entries(userData.content).forEach(([key, data]) => {
            if (data.response_id) {
                Object.entries(data.response_text).forEach(([key2, data2]) => {
                    if (data2.clusterData) {
                        data2.clusterData.coreKey = key;
                        data2.clusterData.subKey = key2;
                        checkClassData[Object.keys(checkClassData).length + 1] = data2.clusterData;
                    }
                });
            } else if (data.type === "label") {
                data.coreKey = key;
                checkClassData[Object.keys(checkClassData).length + 1] = data;
            }
        });

        //calls a function to check proximity between all the components and assigns their class and color accordingly
        Object.entries(checkClassData).forEach(([key, value]) => {
            Object.entries(checkClassData).forEach(([key2, value2]) => {
                if (checkProximity(value.x, value.y, value2.x, value2.y, value.height, value2.height) && value2.userClusterIndexA5 === -1) {
                    if (flag === true) {
                        currentClass = currentClass + 1;
                        flag = false;
                        flag2 = true;
                    }
                    if (flag2 === true && value.userClusterIndexA5 !== -1) {
                        currentClass = currentClass - 1;
                        flag2 = false;

                        checkClassData[key2].userClusterIndexA5 = checkClassData[key].userClusterIndexA5;
                        if (checkClassData[key2].type == "label") {
                            colorsUsedData[checkClassData[key2].userClusterIndexA5] = checkClassData[key2].color;
                        }
                    } else {
                        checkClassData[key2].userClusterIndexA5 = currentClass;
                        flag2 = false;
                        if (checkClassData[key2].type == "label") {
                            colorsUsedData[checkClassData[key2].userClusterIndexA5] = checkClassData[key2].color;
                        }
                    }
                }
            });
            flag = true;
            flag2 = false;
        });

        Object.entries(checkClassData).forEach(([key, data]) => {
            if (data.subKey) {
                userData.content[data.coreKey].response_text[data.subKey].clusterData.userClusterIndexA5 = data.userClusterIndexA5;
            } else {
                userData.content[data.coreKey].userClusterIndexA5 = data.userClusterIndexA5;
            }
        });

        setClustData(userData);
        return colorsUsedData;
    };

    //checks which components are next to each other
    const checkClustering = () => {

        //gets the height of the components (no longer needed)
        Object.entries(clustData.content).map(([key, data]) => {
            if (data.type === "label") {
                const element = document.querySelector(`[data-height-id="${data.id}"]`);
                clustData.content[key].height = element.clientHeight;
            } else if (data.response_id) {
                Object.entries(data.response_text).map(([key2, data2]) => {
                    if (data2.clusterData) {
                        const element = document.querySelector(`[data-height-id="${data2.clusterData.id}"]`);
                        clustData.content[key].response_text[key2].clusterData.height = element.clientHeight;
                    }
                });
            }
        });

        const mainContainer = document.getElementById("main-container");
        sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight);

        let colorsUsedData = {};
        colorsUsedData = checkClass();
        replaceLabelNames();
        const updatedClustData = { ...clustData };

        Object.entries(updatedClustData.content).forEach(([key, value]) => {
            if (value.response_id) {
                Object.entries(value.response_text).forEach(([key2, value2]) => {
                    if (value2.clusterData) {
                        updatedClustData.content[key].response_text[key2].clusterData.color = colorsUsedData[value2.clusterData.userClusterIndexA5];
                    }
                });
            }
        });

        setClustData(updatedClustData);
    };

    //replaces label names after they are edited by the user
    const replaceLabelNames = () => {
        let data = clustData;

        Object.entries(data.content).map(([key, value]) => {
            if (value.type === "label") {
                let val = document.getElementById(value.id).innerHTML;
                data.content[key].clusterLabelA5 = val;
            }
        });

        setClustData(data);
    };

    //handles user dragging of components
    const handleDrag = (e, data, coreKey, subKey) => {

        checkClustering();

        setClustData((prevState) => {
            const updatedContent = { ...prevState.content };
            if (subKey !== undefined) {
                const updatedSubItem = {
                    ...updatedContent[coreKey].response_text[subKey].clusterData,
                    x: data.x,
                    y: data.y,
                };
                updatedContent[coreKey].response_text[subKey].clusterData = updatedSubItem;
            } else {
                const updatedItem = {
                    ...updatedContent[coreKey],
                    x: data.x,
                    y: data.y,
                };
                updatedContent[coreKey] = updatedItem;
            }
            return { ...prevState, content: updatedContent };
        });
    };

    //handles user submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (clustData.content !== undefined) {
            Object.entries(clustData.content).map(([key, data]) => {
                if (data.type === "label") {
                    const element = document.querySelector(`[data-height-id="${data.id}"]`);
                    clustData.content[key].height = element.clientHeight;
                } else if (data.response_id) {
                    Object.entries(data.response_text).map(([key2, data2]) => {
                        if (data2.clusterData) {
                            const element = document.querySelector(`[data-height-id="${data2.clusterData.id}"]`);
                            clustData.content[key].response_text[key2].clusterData.height = element.clientHeight;
                        }
                    });
                }
            });
        }

        const mainContainer = document.getElementById("main-container");
        !blankTemplate && sessionStorage.setItem("mainContainerHeight", mainContainer.clientHeight);

        if (!blankTemplate) {
            checkClass();
            replaceLabelNames();
        }

        let final_data = {};
        final_data.content = clustData;
        final_data.UserId = sessionStorage.getItem("UserId");
        final_data.MLClusters = MLClusters;
        delete final_data["id"];
        final_data.label = document.getElementById("activity-five-label").innerHTML;
        final_data.instruction = document.getElementById("activity-five-instruction").innerHTML;
        final_data.lastAuthored = "student"

        final_data.activity_mvc = {};

        let data = {
            id: sessionStorage.getItem("ActivitiesId"),
            content: final_data,
        };

        let event;

        if (id && sessionStorage.getItem("new-chain") !== "true") {

            //updates activity five
            await axios.post(`http://20.6.129.171:8080/activityfive/byId/${id}`, data)

            if (newChain) {

                //deletes activity id for future activities
                await axios.post(`http://20.6.129.171:8080/activityfive/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);

                sessionStorage.setItem("new-chain", true)
                event = "Reinitialise";

            } else {
                event = "Update";
            }

        } else {

            //create a new entry of activity five
            await axios.post("http://20.6.129.171:8080/activityfive", data)
                .then((response) => {
                    const ActivityFiveId = response.data.id;
                    sessionStorage.setItem("ActivityFiveId", ActivityFiveId);
                });

            event = "Create";
        }

        if (!instructor) {
            let data = {
                DateTime: Date.now(),
                StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
                StudentId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityFiveId"),
                ActivityType: "Activity 5",
            };
            //update student logs
            await axios.post(`http://20.6.129.171:8080/studentlog/create`, data);
        } else {
            let data = {
                DateTime: Date.now(),
                ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
                InstructorId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityFiveId"),
                ActivityType: "Activity 5",
            };
            //update instructor logs
            await axios.post(`http://20.6.129.171:8080/instructorlog/create`, data);
        }

        if (sessionStorage.getItem("ActivitySixId") !== "null" && sessionStorage.getItem("ActivitySixId") !== null) {
            navigate(`/activitysix/${sessionStorage.getItem("ActivitySixId")}`);
        } else {
            navigate("/activitysix");
        }
    };

    //handles removal of labels
    const removeLabel = (key) => {
        setClustData((prevData) => {
            const newData = { ...prevData };
            delete newData.content[key];
            return newData;
        });
    };

    //handles deletion of copies of components
    const handleDeleteCopy = (coreKey, subKey) => {
        setClustData(prevData => {
            const newData = { ...prevData };
            delete newData.content[coreKey].response_text[subKey];
            return newData;
        });
    };

    //handles creations of copies of components
    const handleCreateCopy = (coreKey, subKey) => {
        setClustData(prevState => {
            const newData = { ...prevState };
            const itemToCopy = { ...newData.content[coreKey].response_text[subKey] };
            itemToCopy.clusterData = {
                ...itemToCopy.clusterData,
                id: uuidv4(),
                x: itemToCopy.clusterData.x,
                y: itemToCopy.clusterData.y + 10,
                userClusterIndexA5: -1,
                type: "text-copy",
                height: 0,
            };
            const newSubKey = Object.keys(newData.content[coreKey].response_text).length + 1;
            newData.content[coreKey].response_text[newSubKey] = itemToCopy;
            return newData;
        });
    };

    return (
        <div className="container-activity-5">

            <div className="header-activity-5">

                {/*activity five label*/}
                <h2 dangerouslySetInnerHTML={{ __html: `${label}` }} contentEditable="true" id="activity-five-label" className="editable-label"></h2>
                <Button onClick={() => window.location.reload()} className="reset-button">Reset</Button>
            </div>

            <form onSubmit={handleSubmit}>

                {/*activity five instruction*/}
                <Typography id="activity-five-instruction" dangerouslySetInnerHTML={{ __html: `${instruction}` }} contentEditable={true} className="editable-instruction"></Typography>
                <Typography className="info-text">Labels can be generated by right clicking twice within the lavender box.</Typography>

                {/*machine learning clustering has been disabled*/}
                {!MLClusters && <Typography className="info-text">
                    The instructor has disabled viewing alternate machine learning clustering.
                </Typography>}

                {/*if no transcript has been provided*/}
                {blankTemplate && <Typography className="info-text">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}

                {/*switch to create new chain*/}
                <FormControlLabel style={{ marginTop: 10 }} className="formControlLabelTop" control={
                    <Switch checked={newChain} onChange={() => {
                        if (!newChain) {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Caution: Data associated with the next activity in this sequence will be permanently deleted")) {
                                setNewChain((prev) => !prev);
                            }
                        } else {
                            setNewChain((prev) => !prev);
                        }
                    }}
                    />
                }
                    label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            Re-initialise Activity 5 and subsequent activites
                            <Tooltip title="Use this switch when you want to edit activity five after you have already saved subsequent activities. It will erase the content of the next activity.">
                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                            </Tooltip>
                        </div>
                    }
                />

                {/*switch to view alternative machine learning clustering*/}
                <FormControlLabel style={{ marginTop: 10 }} className="formControlLabelTop" control={
                    <Switch
                        checked={alternateView}
                        disabled={!MLClusters}
                        onChange={() => {
                            createAIClustering();
                            setAlternateView((prev) => !prev);
                        }}
                    />
                }
                    label={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            View AI Clustering
                            <Tooltip title="Use this switch when you would like to view clusters generated by the ML model.">
                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                            </Tooltip>
                        </div>
                    }
                />

                {/*displays components*/}
                {!blankTemplate &&
                    <Box id="main-container" onDoubleClick={handleDoubleClick}>
                        <DisplayComponents clustData={clustData} handleDrag={handleDrag} removeLabel={removeLabel} handleCreateCopy={handleCreateCopy} handleDeleteCopy={handleDeleteCopy} alternateView={alternateView} />
                    </Box>
                }

                <Button fullWidth type="submit" variant="outlined" className="submit-button">Submit</Button>

            </form>

        </div>
    );
};

export default Act5;
