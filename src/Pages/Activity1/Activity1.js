import { Box, Button, ButtonGroup, Container, FormControlLabel, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import TranscriptPreview from './TranscriptPreview';
import './Activity1.css'
import InfoIcon from '@mui/icons-material/Info';

const Activity1 = () => {

  //use state hooks to store relevant values
  const [interviewer, setInterviewer] = useState("");
  const [interviewee, setInterviewee] = useState("");
  const [transcript, setTranscript] = useState("");
  const [interviewerError, setInterviewerError] = useState(false);
  const [intervieweeError, setIntervieweeError] = useState(false);
  const [transcriptError, setTranscriptError] = useState(false);
  const [helperText, setHelperText] = useState("");
  const [previewTranscript, setPreviewTranscript] = useState({});
  const [previewClicked, setPreviewClicked] = useState(false);
  const [transcriptTitle, setTranscriptTitle] = useState("");
  const [label, setLabel] = useState("Activity 1 Label");
  const [instruction, setInstruction] = useState(`Use the text boxes below to provide the details of your interview transcript. After you fill in the boxes, click the Preview button to see how the transcript looks before proceeding to the next activity. If you would like to make any changes you can do so by editing the transcript text directly. Click the Submit button when you are satisfied with the look of your interview transcript. The final version of your transcript will be used in the next activity.`);
  const [previewClickedError, setPreviewClickedError] = useState("");
  const [notEditableTranscript, setNotEditableTranscript] = useState(false);
  const [instructor, setInstructor] = useState(false);
  const [newChain, setNewChain] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {

    //checks if id passed in the url is null
    if (id === "null") {
      alert("In order to access Activity 1, please initialise a chain of activities.");
      navigate("/")
    }

    //checks occupation of the user
    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    //if valid id is passed, fetch data from activity one database and populate the variables accordingly
    if (id) {
      axios.get(`http://20.6.129.171:8080/activityone/byId/${id}`)
        .then((response) => {
          if (response.data) {

            //title
            if (response.data.transcript_source_id) {
              setTranscriptTitle(response.data.transcript_source_id);
            }

            //interviewer and interviewee
            if (response.data.content && Object.entries(response.data.content).length !== 0) {
              if (response.data.content[1].questioner_tag) {
                setInterviewer(response.data.content[1].questioner_tag);
              }
              if (response.data.content[2].response_tag) {
                setInterviewee(response.data.content[2].response_tag);
              }
            }

            //standardised transcript
            if (response.data.transcriptEditable) {
              setNotEditableTranscript(response.data.transcriptEditable);
            }
            sessionStorage.setItem("setNotEditableTranscript", response.data.transcriptEditable);

            //label
            if (response.data.label) {
              setLabel(response.data.label);
            }

            //instruction
            if (response.data.instruction) {
              setInstruction(response.data.instruction);
            }

            //transcript
            if (response.data.content && Object.entries(response.data.content).length !== 0) {
              let transcriptText = "";
              Object.entries(response.data.content).map(([key, value]) => {
                if (value.questioner_tag !== undefined) {
                  if (transcriptText === "") {
                    transcriptText = transcriptText + value.questioner_tag + ": " + value.question_text;
                  } else {
                    transcriptText = transcriptText + "\n\n" + value.questioner_tag + ": " + value.question_text;
                  }
                } else {
                  transcriptText = transcriptText + "\n\n" + value.response_tag + ": ";
                  Object.entries(value.response_text).map(([key2, value2]) => {
                    transcriptText = transcriptText + " " + value2.text;
                  });
                }
              });
              setTranscript(transcriptText);
            }

          }
        });
    }
  }, []);

  //checks whether all necessary fields have been filled
  const validateInputs = () => {
    setHelperText('');
    setPreviewClickedError('');
    setInterviewerError(false);
    setIntervieweeError(false);
    setTranscriptError(false);

    let flag = false;
    if (!interviewer) {
      setInterviewerError(true);
      flag = true;
    }
    if (!interviewee) {
      setIntervieweeError(true);
      flag = true;
    }
    if (!transcript) {
      setTranscriptError(true);
      flag = true;
    }

    return !flag ? true : false;
  }

  //submission of activity one
  const handleSubmit = async (e) => {

    e.preventDefault()

    let transcript_source_id = transcriptTitle;
    let activity_mvc_content = {};

    if (transcript) {
      setPreviewClickedError("");

      //checks whether preview button has been previously clicked
      if (previewClicked === false) {
        setPreviewClickedError("Please click the 'Preview' button to review the transcript before submitting.");
        return;
      }

      //iterates through transcript and retrives associated html and css
      Object.entries(previewTranscript).map(([key, value]) => {
        if (value.questioner_tag !== undefined) {
          activity_mvc_content[key] = getActivityMVC(key);
        } else {
          activity_mvc_content[key] = {};
          Object.entries(previewTranscript[key].response_text).map(
            ([key2, value]) => {
              activity_mvc_content[key][key2] = getActivityMVC(
                key.toString() + key2.toString()
              );
            }
          );
        }
      });

    }

    let final_data = {
      transcript_source_id: transcript_source_id,
      content: previewTranscript,
      UserId: sessionStorage.getItem("UserId"),
      transcriptEditable: notEditableTranscript,
      label: document.getElementById("activity-one-label").innerHTML,
      instruction: document.getElementById("activity-one-instruction").innerHTML,
      activity_mvc: activity_mvc_content,
      lastAuthored: instructor ? "instructor" : "student",
    };

    let event;

    //if id parameter exists
    if (id) {

      //updates activity one
      await axios.post(`http://20.6.129.171:8080/activityone/byId/${id}`, final_data);

      if (newChain) {

        //deletes activity id of future activities
        await axios.post(`http://20.6.129.171:8080/activityone/byId/${sessionStorage.getItem("ActivitiesId")}/new-chain`);
        sessionStorage.setItem("new-chain", true)
        event = "Reinitialise"

      } else {
        event = "Update"
      }

    } else {

      //creates a new entry of activity one
      await axios.post("http://20.6.129.171:8080/activityone", final_data)
        .then((response) => {
          const ActivitiesID = response.data.ActivitiesId.id;
          const ActivityOneId = response.data.ActivityOneId;
          sessionStorage.setItem("ActivitiesId", ActivitiesID);
          sessionStorage.setItem("ActivityOneId", ActivityOneId);
        });

      event = "Create"

    }

    if (!instructor) {

      let data = {
        DateTime: Date.now(),
        StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
        StudentId: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem("ActivityOneId"),
        ActivityType: "Activity 1",
      };

      //updates student log
      await axios.post(`http://20.6.129.171:8080/studentlog/create`, data);

    } else {

      let data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem("ActivityOneId"),
        ActivityType: "Activity 1",
      };

      //updates instructor log
      await axios.post(`http://20.6.129.171:8080/instructorlog/create`, data);

    }

    if (sessionStorage.getItem("ActivityTwoId") !== "null" && sessionStorage.getItem("ActivityTwoId") !== null && sessionStorage.getItem("ActivityTwoId") !== "undefined") {
      navigate(`/activitytwo/${sessionStorage.getItem("ActivityTwoId")}`);
    } else {
      navigate("/activitytwo");
    }

  };

  //gets html and css of each of the sentences in the transcript
  const getActivityMVC = (value) => {
    const element = document.querySelector(`[id="${value}"]`);
    if (element) {
      const htmlContent = element.outerHTML;
      const inlineStyles = element.getAttribute("style") || "No inline styles";
      return { html: htmlContent, css: inlineStyles };
    } else {
      alert("Element not found");
      return undefined;
    }
  };

  const handlePreviewData = (result) => {
    if (result.error) {
      setHelperText(result.error);
      setPreviewTranscript({});
    } else {
      setPreviewTranscript(result.data);
      setHelperText('');
    }
  };

  return (
    <div className="container-activity-1">

      <div className="header-activity-1">

        {/*activity one label*/}
        <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" id="activity-one-label"></h2>
        <Button onClick={() => { window.location.reload(); }} className="reset-btn">
          Reset
        </Button>

      </div>

      <form onSubmit={handleSubmit} noValidate autoComplete="off">

        {/*activity one instruction*/}
        <Typography id="activity-one-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true} className="instructions"></Typography>

        {/*displays switch button to instructors only for selecting whether trascript is editable*/}
        {instructor && (<FormControlLabel className="switch-label"
          control={
            <Switch checked={notEditableTranscript} onChange={() => setNotEditableTranscript((prev) => !prev)} />
          }
          label={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              Standardised Script
              <Tooltip title="The transcript is standardized and cannot be edited by students across all template copies.">
                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
              </Tooltip>
            </div>
          }
        />
        )}

        {/*switch button to create a new chain and reinitialise future activities*/}
        <FormControlLabel className="switch-label"
          control={
            <Switch checked={newChain} onChange={() => {
              if (!newChain) {
                // eslint-disable-next-line no-restricted-globals
                if (confirm("Please note: Data related to the following five activities will be permanently erased.")) {
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
              Re-initialise Activity 1 and subsequent activites
              <Tooltip title="Use this switch when you want to edit activity one after you have already saved subsequent activities. It will erase the content of the next five activities.">
                <InfoIcon style={{ marginLeft: 4 }} fontSize="small" />
              </Tooltip>
            </div>
          }
        />

        {/*informs students whether transcript is editable*/}
        {!instructor && notEditableTranscript && (
          <Typography className="switch-label">The transcript cannot be edited in this template.</Typography>
        )}

        {/*title*/}
        <TextField
          className="text-field-activity-1"
          margin="normal"
          value={transcriptTitle}
          label="Transcript title"
          fullWidth
          onChange={(e) => setTranscriptTitle(e.target.value)}
        ></TextField>

        {/*interviewer*/}
        <TextField
          className="text-field-activity-1"
          disabled={!instructor && notEditableTranscript}
          error={interviewerError}
          margin="normal"
          value={interviewer}
          fullWidth
          variant="outlined"
          label="Interviewer label (e.g. Interviewer)"
          onChange={(e) => setInterviewer(e.target.value)}
        ></TextField>

        {/*interviewee*/}
        <TextField
          className="text-field-activity-1"
          disabled={!instructor && notEditableTranscript}
          error={intervieweeError}
          margin="normal"
          value={interviewee}
          fullWidth
          variant="outlined"
          label="Interviewee label (e.g. Interviewee)"
          onChange={(e) => setInterviewee(e.target.value)}
        ></TextField>

        {/*transcript*/}
        <TextField
          className="text-field-activity-1"
          disabled={!instructor && notEditableTranscript}
          helperText={helperText}
          error={transcriptError}
          margin="normal"
          value={transcript}
          rows={15}
          fullWidth
          multiline
          variant="outlined"
          label="Transcript"
          onChange={(e) => setTranscript(e.target.value)}
        ></TextField>

        {/*preview transcript*/}
        <Box className="preview-box">
          {!previewClicked && <Typography align="center">Please click the 'Preview' button to view the transcript.</Typography>}
          {previewClicked && <TranscriptPreview interviewer={interviewer} interviewee={interviewee} transcript={transcript} onPreviewGenerated={handlePreviewData} />}
        </Box>

        <Typography sx={{ marginTop: previewClickedError ? 1 : 1 }}>
          {previewClickedError}
        </Typography>

        <ButtonGroup fullWidth>
          <Button onClick={() => { setPreviewClicked(true); setPreviewClickedError(""); if (!instructor) { validateInputs() } }} className="preview-btn" variant="text" fullWidth>
            Preview
          </Button>
          <Button className="submit-btn" fullWidth type="submit" variant="outlined">
            Submit
          </Button>
        </ButtonGroup>

      </form>

    </div>
  );
};

export default Activity1;