import { Typography, Button, FormControlLabel, Switch, Divider, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DisplayTranscript from "./DisplayTranscript";
import './Activity2.css'
import InfoIcon from '@mui/icons-material/Info';

const Activity2 = () => {

    //use state hooks to store relevant values
    const [activityMVCContent, setActivityMVCContent] = useState({});
    const [userData, setUserData] = useState({});
    const [highlightingNotAllowed, setHighlightingNotAllowed] = useState(false);
    const [label, setLabel] = useState("Activity 2 Label");
    const [instruction, setInstruction] = useState(`Read through the transcript and click on sentences from the <strong>interviewee</strong> that you think provide insights or convey important information. Clicking a sentence will highlight it in yellow. Clicking a highlighted sentence again will unhighlight it. When you are satisfied with your sentence selections, click the Submit button to continue to the next activity. Your choices of which sentences to highlight will be carried forward to the next activity.`);
    const [newChain, setNewChain] = useState(false);
    const [instructor, setInstructor] = useState(false);
    const [blankTemplate, setBlankTemplate] = useState(false)
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

        if (id) {
            // if valid id exists, fetch data from activity 2 table
            axios.get(`http://20.6.129.171:8080/activitytwo/byId/${id}`)
                .then((response) => {
                    if (response.data !== null) {
                        //standardised highlighting
                        if (response.data.predefinedHighlighting !== null) {
                            setHighlightingNotAllowed(response.data.predefinedHighlighting);
                        }

                        //label
                        setLabel(response.data.label);

                        //instruction
                        setInstruction(response.data.instruction);

                        //in the case the instructor defines a blank template or transcript is editable
                        if (Object.entries(response.data.content).length === 0 || sessionStorage.getItem("setNotEditableTranscript") !== "true") {
                            //fetches data from activity one
                            axios.get(`http://20.6.129.171:8080/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`)
                                .then((response) => {
                                    if (response.data !== null) {
                                        setUserData(response.data);

                                        //get activity mvc for transcript data
                                        if (response.data.content !== null && Object.entries(response.data.content).length !== 0) {
                                            let interviewer = response.data.content[1].questioner_tag;
                                            let interviewee = response.data.content[2].response_tag;

                                            let activity_mvc_data = {};

                                            for (let i = 1; i < Object.keys(response.data.activity_mvc).length + 1; i++) {
                                                if (i % 2 !== 0) {
                                                    activity_mvc_data[i] = {
                                                        tag: interviewer,
                                                        activity_mvc: response.data.activity_mvc[i],
                                                    };
                                                } else {
                                                    activity_mvc_data[i] = {
                                                        tag: interviewee,
                                                        activity_mvc: response.data.activity_mvc[i],
                                                    };
                                                }
                                            }
                                            setActivityMVCContent(activity_mvc_data);
                                        } else {
                                            setBlankTemplate(true)
                                        }
                                    }
                                })

                        } else {
                            //user has not created a new chain 
                            if (sessionStorage.getItem("new-chain") !== "true") {
                                setUserData(response.data);

                                //gets activity mvc for transcript data
                                if (response.data.content !== null && Object.entries(response.data.content).length !== 0) {
                                    let interviewer = response.data.content[1].questioner_tag;
                                    let interviewee = response.data.content[2].response_tag;

                                    let activity_mvc_data = {};

                                    for (let i = 1; i < Object.keys(response.data.activity_mvc).length + 1; i++) {
                                        if (i % 2 !== 0) {
                                            activity_mvc_data[i] = {
                                                tag: interviewer,
                                                activity_mvc: response.data.activity_mvc[i],
                                            };
                                        } else {
                                            activity_mvc_data[i] = {
                                                tag: interviewee,
                                                activity_mvc: response.data.activity_mvc[i],
                                            };
                                        }
                                    }
                                    setActivityMVCContent(activity_mvc_data);
                                } else {
                                    setBlankTemplate(true)
                                }

                            }
                        }
                    }
                });
        }

        //if an id is not provided or user has created a new chain
        if (id === undefined || sessionStorage.getItem("new-chain") === "true") {

            //retrieve data from activity one since activity two instance does not exist
            axios.get(`http://20.6.129.171:8080/activityone/byId/${sessionStorage.getItem("ActivityOneId")}`)
                .then((response) => {
                    if (response.data !== null) {
                        setUserData(response.data);

                        //get activity mvc for transcript data
                        if (response.data.content !== null && Object.entries(response.data.content).length !== 0) {
                            let interviewer = response.data.content[1].questioner_tag;
                            let interviewee = response.data.content[2].response_tag;

                            let activity_mvc_data = {};

                            for (let i = 1; i < Object.keys(response.data.activity_mvc).length + 1; i++) {
                                if (i % 2 !== 0) {
                                    activity_mvc_data[i] = {
                                        tag: interviewer,
                                        activity_mvc: response.data.activity_mvc[i],
                                    };
                                } else {
                                    activity_mvc_data[i] = {
                                        tag: interviewee,
                                        activity_mvc: response.data.activity_mvc[i],
                                    };
                                }
                            }
                            setActivityMVCContent(activity_mvc_data);
                        } else {
                            setBlankTemplate(true)
                        }

                    } else {
                        alert("Before progressing to Activity 2, please complete Activity 1.");
                    }
                });
            //if id is null       
        } 
    }, []);

    //gets html and css associated with sentences in transcript
    const getActivityMVC = (value) => {
        const element = document.querySelector(`[id="${value}"]`);
        if (element) {
            const htmlContent = element.outerHTML;
            const backgroundColor = element.style.backgroundColor;
            const inlineStyles = element.getAttribute("style")
                ? element.getAttribute("style")
                : "No inline styles";
            return { html: htmlContent, css: inlineStyles };
        } else {
            alert("Element not found");
            return undefined;
        }
    };

    //handles user submission for activity two
    const handleSubmit = async (e) => {

        e.preventDefault();
        let userContent = userData;

        //checks for yellow background color
        const check = new RegExp("background-color: rgb\\(\\s*255\\s*,\\s*199\\s*,\\s*44\\s*\\)", "g");

        //gets activity mvc after user changes
        for (let i = 1; i < Object.keys(userContent.activity_mvc).length + 1; i++) {
            if (i % 2 != 0) {
                let activity_mvc_value = getActivityMVC(i.toString());
                userContent.activity_mvc[i] = activity_mvc_value;
                userContent.content[i].sentenceUserHighlightA2 = false;
            } else {
                for (
                    let j = 1; j < Object.keys(userContent.activity_mvc[i]).length + 1; j++) {
                    let activity_mvc_value = getActivityMVC(i.toString() + j.toString());
                    userContent.activity_mvc[i][j] = activity_mvc_value;
                    if (activity_mvc_value.css.match(check)) {
                        userContent.content[i].response_text[j].sentenceUserHighlightA2 = true;
                    } else {
                        userContent.content[i].response_text[j].sentenceUserHighlightA2 = false;
                    }
                }
            }
        }

        if (!id) {
            delete userContent["transcriptEditable"];
        }

        delete userContent["id"];

        userContent.predefinedHighlighting = highlightingNotAllowed;
        userContent.UserId = sessionStorage.getItem("UserId");
        userContent.label = document.getElementById("activity-two-label").innerHTML;
        userContent.instruction = document.getElementById("activity-two-instruction").innerHTML;
        userContent.lastAuthored = instructor ? "instructor" : "student";

        let data = {
            id: sessionStorage.getItem("ActivitiesId"),
            content: userContent,
        };

        let event;

        if (id && sessionStorage.getItem("new-chain") !== "true") {

            //updates activity two
            await axios.post(`http://20.6.129.171:8080/activitytwo/byId/${id}`, data);

            if (newChain) {

                //deletes activity id for future activities
                await axios.post(`http://20.6.129.171:8080/activitytwo/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
                sessionStorage.setItem("new-chain", true)
                event = "Reinitialise";

            } else {
                event = "Update";
            }

        } else {

            //create a new entry of activity two
            await axios.post("http://20.6.129.171:8080/activitytwo", data)
                .then((response) => {
                    const ActivityTwoId = response.data.id;
                    sessionStorage.setItem("ActivityTwoId", ActivityTwoId);
                });

            event = "Create";
        }

        if (!instructor) {
            let data = {
                DateTime: Date.now(),
                StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
                StudentId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityTwoId"),
                ActivityType: "Activity 2",
            };
            //update student logs
            await axios.post(`http://20.6.129.171:8080/studentlog/create`, data);
        } else {
            let data = {
                DateTime: Date.now(),
                ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
                InstructorId: sessionStorage.getItem("UserId"),
                Event: event,
                ActivityId: sessionStorage.getItem("ActivityTwoId"),
                ActivityType: "Activity 2",
            };
            //update instructor logs
            await axios.post(`http://20.6.129.171:8080/instructorlog/create`, data);
        }

        sessionStorage.setItem("predefinedHighlighting", highlightingNotAllowed);

        //navigates to next activity
        if (sessionStorage.getItem("custom-activities-instructor") === "true") {
            navigate("/");
        } else if (sessionStorage.getItem("ActivityThreeId") !== "null" && sessionStorage.getItem("ActivityThreeId") !== null) {
            navigate(`/activitythree/${sessionStorage.getItem("ActivityThreeId")}`);
        } else {
            navigate("/activitythree");
        }
    };

    return (
        <div className='container-activity-2'>

            <div className="header-activity-2">

                {/*activity two label*/}
                <h2 dangerouslySetInnerHTML={{ __html: label }}
                    contentEditable={true}
                    id="activity-two-label"
                ></h2>

                <Button onClick={() => window.location.reload()} className="reset-button">
                    Reset
                </Button>

            </div>

            <form onSubmit={handleSubmit}>

                {/*activity two instruciton*/}
                <Typography id="activity-two-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} className="editable-instruction"></Typography>

                {instructor && <Divider className="divider" />}

                {/*display this information only to instructors*/}
                {instructor && (
                    <Typography className="info-text">
                        After submitting this activity, you will be automatically redirected to the home page. From there, you can return to select configurations for the remaining activities.
                    </Typography>
                )}

                {/*if no transcript has been provided*/}
                {blankTemplate && <Typography className="info-text">
                    No transcript has been displayed since no data was entered in Activity 1.
                </Typography>}

                {/*display the switch for standard highlighting only to instructors*/}
                {instructor && (
                    <FormControlLabel className="formControlLabel" control={
                        <Switch checked={highlightingNotAllowed} onChange={() => setHighlightingNotAllowed((prev) => !prev)} />
                    }
                        label={
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                Standardised Script Highlighting
                                <Tooltip title="The highlighting of the script is standardized and cannot be edited by students across all template copies.">
                                    <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                                </Tooltip>
                            </div>
                        }

                    />
                )}

                {/*informs users regarding standardised highlighting*/}
                {!instructor && highlightingNotAllowed && (
                    <Typography className="info-text">
                        You are not allowed to edit the highlighting of the transcript in this template.
                    </Typography>
                )}

                {/*switch for new chain*/}
                <FormControlLabel className="formControlLabel" control={
                    <Switch checked={newChain} onChange={() => {
                        if (!newChain) {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Caution: Data associated with the next four activities in this sequence will be permanently deleted")) {
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
                            Re-initialise Activity 2 and subsequent activites
                            <Tooltip title="Use this switch when you want to edit activity two after you have already saved subsequent activities. It will erase the content of the next four activities.">
                                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
                            </Tooltip>
                        </div>
                    }
                />

                {/*displays transcript*/}
                {!blankTemplate ? <DisplayTranscript activityMVCContent={activityMVCContent} highlightingNotAllowed={highlightingNotAllowed} /> : <></>}
                <Button className="submit-button" fullWidth type="submit" variant="outlined">
                    Submit
                </Button>

            </form>
        </div>
    );
};

export default Activity2;