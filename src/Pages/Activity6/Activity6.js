import './Activity6.css'
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DisplayComponents from './DisplayComponents';

const Act6 = () => {

  //use state hooks to store relevant values
  const [clustData, setClustData] = useState({});
  const [instructor, setInstructor] = useState(false);
  const [label, setLabel] = useState("Activity 6 Label");
  const [insightsAndNeeds, setInsightsAndNeeds] = useState({});
  const [blankTemplate, setBlankTemplate] = useState(false)
  const [instruction, setInstruction] = useState(`
      <Typography>The sentences and cluster labels you submitted for the previous activity have been arranged in the space below. For each cluster, add any number of insights that you think emerge from the selected sentences. After surfacing the insights, add a set of needs that relate to those insights one at a time. Identifying the insights and needs should be helpful when designing your prototype.</Typography>
      <br/>
      <br/>
      <Typography>When you are satisfied with your listed insights and needs, click the Submit button to complete this stage of the design thinking process. You can come back and make changes to your submissions whenever you like.</Typography>`);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    // checks if id passed in the url is null
    if (id === "null") {
      alert("Please go back to the previous activity and submit it to continue.");
    }

    // checks occupation of the user
    if (sessionStorage.getItem("Occupation") == "Instructor") {
      setInstructor(true);
    }

    //if valid id exists, fetch data from activity six
    if (id) {
      axios.get(`http://20.6.129.171:8080/activitysix/byId/${id}`)
        .then((response) => {

          //label
          setLabel(response.data.label);

          //instruction
          setInstruction(response.data.instruction);

          //if the activity was last authored by an instructor, it gets it data from activity five
          if (response.data.lastAuthored === "instructor") {
            axios.get(`http://20.6.129.171:8080/activityfive/byId/${sessionStorage.getItem("ActivityFiveId")}`)
              .then((response) => {
                if (response.data !== null) {
                  //creates placeholders for insights and needs
                  let insightsAndNeeds = {};
                  if (Object.entries(response.data.content).length !== 0) {
                    Object.entries(response.data.content.content).map(([key, value]) => {
                      if (value.type === "label") {
                        insightsAndNeeds[value.userClusterIndexA5] = {
                          content: {},
                          insights: {},
                          needs: {},
                          label: {
                            text: value.clusterLabelA5,
                            coreKey: value.coreKey,
                          },
                        };
                      }
                    }
                    );

                    Object.entries(response.data.content.content).map(([key, value]) => {
                      if (value.response_id) {
                        Object.entries(value.response_text).map(([key2, value2]) => {
                          if (value2.clusterData) {
                            if (insightsAndNeeds[value2.clusterData.userClusterIndexA5] !== undefined) {
                              insightsAndNeeds[value2.clusterData.userClusterIndexA5].content[Object.keys(insightsAndNeeds[value2.clusterData.userClusterIndexA5].content).length] = {
                                text: value2.text,
                                coreKey: value2.clusterData.coreKey,
                                subKey: value2.clusterData.subKey,
                              };
                            }
                          }
                        });
                      }
                    }
                    );
                  } else {
                    setBlankTemplate(true)
                  }
                  setInsightsAndNeeds(insightsAndNeeds);
                  setClustData(response.data.content);
                }
              })
          } else {
            //if an id is not provided or user has created a new chain
            if (response.data.content !== null && sessionStorage.getItem("new-chain") !== "true") {
              setClustData(response.data.content);
              //creates placeholders for insights and needs
              let insightsAndNeeds = {};
              if (response.data.content.content !== undefined) {
                Object.entries(response.data.content.content).map(([key, value]) => {
                  if (value.type === "label") {
                    insightsAndNeeds[value.userClusterIndexA5] = {
                      content: {},
                      insights: {},
                      needs: {},
                      label: { text: value.clusterLabelA5, coreKey: value.coreKey },
                    };
                  }
                }
                );
                Object.entries(response.data.content.content).map(([key, value]) => {
                  if (value.response_id) {
                    Object.entries(value.response_text).map(([key2, value2]) => {
                      if (value2.clusterData) {
                        if (insightsAndNeeds[value2.clusterData.userClusterIndexA5] !== undefined) {
                          insightsAndNeeds[value2.clusterData.userClusterIndexA5].content[Object.keys(insightsAndNeeds[value2.clusterData.userClusterIndexA5].content).length] = {
                            text: value2.text,
                            coreKey: value2.clusterData.coreKey,
                            subKey: value2.clusterData.subKey,
                          };
                        }
                      }
                    });
                  }
                }
                );
                Object.entries(response.data.content.insightsAndNeeds).map(([key, value]) => {
                  insightsAndNeeds[key].needs = value.needs;
                  insightsAndNeeds[key].insights = value.insights;
                }
                );

                setInsightsAndNeeds(insightsAndNeeds);
              } else {
                setBlankTemplate(true)
              }
            }
          }
        });
    }

    //if an id is not provided or user has created a new chain
    if (id === undefined || sessionStorage.getItem("new-chain") === "true") {
      axios.get(`http://20.6.129.171:8080/activityfive/byId/${sessionStorage.getItem("ActivityFiveId")}`)
        .then((response) => {
          if (response.data !== null) {
            //creates placeholders for insights and needs
            let insightsAndNeeds = {};
            if (Object.entries(response.data.content).length !== 0) {
              Object.entries(response.data.content.content).map(
                ([key, value]) => {
                  if (value.type === "label") {
                    insightsAndNeeds[value.userClusterIndexA5] = {
                      content: {},
                      insights: {},
                      needs: {},
                      label: {
                        text: value.clusterLabelA5,
                        coreKey: value.coreKey,
                      },
                    };
                  }
                }
              );

              Object.entries(response.data.content.content).map(([key, value]) => {
                if (value.response_id) {
                  Object.entries(value.response_text).map(([key2, value2]) => {
                    if (value2.clusterData) {
                      if (insightsAndNeeds[value2.clusterData.userClusterIndexA5] !== undefined) {
                        insightsAndNeeds[value2.clusterData.userClusterIndexA5].content[Object.keys(insightsAndNeeds[value2.clusterData.userClusterIndexA5].content).length] = {
                          text: value2.text,
                          coreKey: value2.clusterData.coreKey,
                          subKey: value2.clusterData.subKey,
                        };
                      }
                    }
                  });
                }
              }
              );
            } else {
              setBlankTemplate(true)
            }
            setInsightsAndNeeds(insightsAndNeeds);
            setClustData(response.data.content);
          } else if (id === "null") {
            alert("Before progressing to Activity 6, please complete Activity 5.");
          }
        });
    }
  }, []);

  //handles deletion of insights
  const deleteInsight = (baseKey, key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      delete newData[baseKey].insights[key];
      return newData;
    });
  };

  //handles deletion of needs
  const deleteNeeds = (baseKey, key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      delete newData[baseKey].needs[key];
      return newData;
    });
  };

  //handles creation of insights
  const addInsight = (key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      newData[key].insights[Object.keys(newData[key].insights).length] = "Edit";
      return newData;
    });
  };

  //handles creation of needs
  const addNeed = (key) => {
    setInsightsAndNeeds((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      newData[key].needs[Object.keys(newData[key].needs).length] = "Edit";
      return newData;
    });
  };

  //handles submission of data
  const handleSubmit = async (e) => {
    e.preventDefault();
    replaceName();

    if (!id) {
      delete clustData["MLClusters"];
    }

    let finalData = {};
    finalData.content = clustData;
    delete finalData["id"];
    finalData.label = document.getElementById("activity-six-label").innerHTML;
    finalData.instruction = document.getElementById("activity-six-instruction").innerHTML;
    finalData.UserId = sessionStorage.getItem("UserId");
    finalData.ActivityFiveId = sessionStorage.getItem("ActivityFiveId");
    finalData.content.insightsAndNeeds = {};
    finalData.activity_mvc = {};
    finalData.lastAuthored = "student"

    Object.entries(insightsAndNeeds).map(([key, value]) => {
      finalData.content.insightsAndNeeds[key] = {
        insights: value.insights,
        needs: value.needs,
      };
    });

    let data = {
      id: sessionStorage.getItem("ActivitiesId"),
      content: finalData,
    };

    let event;

    if (id && sessionStorage.getItem("new-chain") !== "true") {

      //updates activity six
      await axios.post(`http://20.6.129.171:8080/activitysix/byId/${id}`, data);
      event = "Update";

    } else {

      //create new entry of activity six
      await axios.post("http://20.6.129.171:8080/activitysix", data)
        .then((response) => {
          const ActivitySixId = response.data.id;
          sessionStorage.setItem("ActivitySixId", ActivitySixId);
        });
      event = "Create";

    }

    if (!instructor) {
      let data = {
        DateTime: Date.now(),
        StudentTemplateId: sessionStorage.getItem("ActivitiesId"),
        StudentId: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem("ActivitySixId"),
        ActivityType: "Activity 6",
      };
      //updates student logs
      await axios.post(`http://20.6.129.171:8080/studentlog/create`, data);
    } else {
      let data = {
        DateTime: Date.now(),
        ActivitySequenceId: sessionStorage.getItem("ActivitiesId"),
        InstructorId: sessionStorage.getItem("UserId"),
        Event: event,
        ActivityId: sessionStorage.getItem("ActivitySixId"),
        ActivityType: "Activity 6",
      };
      //updates instructor logs
      await axios.post(`http://20.6.129.171:8080/instructorlog/create`, data);
    }

    let summary_data = {};

    const correspondingLabelA4 = (index) => {
      const foundEntry = Object.entries(finalData.content.content).find(([key, value]) => {
        if (value.type === "label") {
          return value.userClusterIndexA4 === index;
        }
      }
      );
      if (foundEntry) {
        const [key, value] = foundEntry;
        return value.clusterLabelA4;
      } else {
        return null;
      }

    };

    const correspondingLabelA5 = (index) => {
      const foundEntry = Object.entries(finalData.content.content).find(
        ([key, value]) => {
          if (value.type === "label") {
            return value.userClusterIndexA5 === index;
          }
        }
      );
      if (foundEntry) {
        const [key, value] = foundEntry;
        return value.clusterLabelA5;
      } else {
        return null;
      }
    };

    if (!instructor) {
      if (finalData.content.content !== undefined) {
        Object.entries(finalData.content.content).map(([key, value]) => {
          if (value.response_id) {
            Object.entries(value.response_text).map(([key2, value2]) => {
              if (value2.clusterData) {
                if (!finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5] ||
                  (Object.keys(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].insights).length === 0 &&
                    Object.keys(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].needs).length === 0)
                ) {
                  summary_data[Object.keys(summary_data).length] = {
                    InstructorId: null,
                    ActivitySequenceId: null,
                    StudentId: parseInt(sessionStorage.getItem("UserId")),
                    StudentTemplateId: parseInt(sessionStorage.getItem("ActivitiesId")),
                    InterviewerSentenceIndexA1: value.response_id,
                    InterviewerSentenceContentA1: finalData.content.content[value.response_id].question_text,
                    IntervieweeSentenceIndexA1: parseInt(key2),
                    IntervieweeSentenceContentA1: value2.text,
                    SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                    SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                    SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                    UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                    UserClusterLabelA4: correspondingLabelA4(value2.clusterData.userClusterIndexA4),
                    UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                    UserClusterLabelA5: correspondingLabelA5(value2.clusterData.userClusterIndexA5),
                    MLClusterIndexA5: value2.sentenceAIClassified,
                    InsightIndex: null,
                    InsightLabel: null,
                    NeedIndex: null,
                    NeedLabel: null,
                  };
                } else if (Object.keys(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].insights).length === 0
                ) {
                  Object.entries(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].needs).map(([key4, value4]) => {
                    summary_data[Object.keys(summary_data).length] = {
                      InstructorId: null,
                      ActivitySequenceId: null,
                      StudentId: parseInt(sessionStorage.getItem("UserId")),
                      StudentTemplateId: parseInt(sessionStorage.getItem("ActivitiesId")),
                      InterviewerSentenceIndexA1: value.response_id,
                      InterviewerSentenceContentA1: finalData.content.content[value.response_id].question_text,
                      IntervieweeSentenceIndexA1: parseInt(key2),
                      IntervieweeSentenceContentA1: value2.text,
                      SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                      SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                      SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                      UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                      UserClusterLabelA4: correspondingLabelA4(value2.clusterData.userClusterIndexA4),
                      UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                      UserClusterLabelA5: correspondingLabelA5(value2.clusterData.userClusterIndexA5),
                      MLClusterIndexA5: value2.sentenceAIClassified,
                      InsightIndex: null,
                      InsightLabel: null,
                      NeedIndex: key4,
                      NeedLabel: value4,
                    };
                  });
                } else if (Object.keys(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].needs).length === 0) {
                  Object.entries(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].insights).map(([key3, value3]) => {
                    summary_data[Object.keys(summary_data).length] = {
                      InstructorId: null,
                      ActivitySequenceId: null,
                      StudentId: parseInt(sessionStorage.getItem("UserId")),
                      StudentTemplateId: parseInt(sessionStorage.getItem("ActivitiesId")),
                      InterviewerSentenceIndexA1: value.response_id,
                      InterviewerSentenceContentA1: finalData.content.content[value.response_id].question_text,
                      IntervieweeSentenceIndexA1: parseInt(key2),
                      IntervieweeSentenceContentA1: value2.text,
                      SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                      SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                      SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                      UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                      UserClusterLabelA4: correspondingLabelA4(value2.clusterData.userClusterIndexA4),
                      UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                      UserClusterLabelA5: correspondingLabelA5(value2.clusterData.userClusterIndexA5),
                      MLClusterIndexA5: value2.sentenceAIClassified,
                      InsightIndex: key3,
                      InsightLabel: value3,
                      NeedIndex: null,
                      NeedLabel: null,
                    };
                  });
                } else {
                  Object.entries(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].insights).map(([key3, value3]) => {
                    Object.entries(finalData.content.insightsAndNeeds[value2.clusterData.userClusterIndexA5].needs).map(([key4, value4]) => {
                      summary_data[Object.keys(summary_data).length] = {
                        InstructorId: null,
                        ActivitySequenceId: null,
                        StudentId: parseInt(sessionStorage.getItem("UserId")),
                        StudentTemplateId: parseInt(sessionStorage.getItem("ActivitiesId")),
                        InterviewerSentenceIndexA1: value.response_id,
                        InterviewerSentenceContentA1: finalData.content.content[value.response_id].question_text,
                        IntervieweeSentenceIndexA1: parseInt(key2),
                        IntervieweeSentenceContentA1: value2.text,
                        SentenceUserHighlightA2: value2.sentenceUserHighlightA2,
                        SentenceUserHighlightA3: value2.sentenceUserHighlightA3,
                        SentenceMLHighlightA3: value2.sentenceMLHighlightA3,
                        UserClusterIndexA4: value2.clusterData.userClusterIndexA4,
                        UserClusterLabelA4: correspondingLabelA4(value2.clusterData.userClusterIndexA4),
                        UserClusterIndexA5: value2.clusterData.userClusterIndexA5,
                        UserClusterLabelA5: correspondingLabelA5(value2.clusterData.userClusterIndexA5),
                        MLClusterIndexA5: value2.sentenceAIClassified,
                        InsightIndex: key3,
                        InsightLabel: value3,
                        NeedIndex: key4,
                        NeedLabel: value4,
                      };
                    });
                  });
                }
              }

            });
          }
        });
      }

    }
    Object.entries(summary_data).map(([key, value]) => {
      axios.post(`http://20.6.129.171:8080/summary/create`, value);
    });

    navigate("/home");
  };

  //replace names of insight and needs after they are edited
  const replaceName = () => {
    Object.entries(insightsAndNeeds).map(([key, value]) => {
      Object.entries(value.insights).map(([key2, value2]) => {
        let val = document.querySelector(`[Insight-id="${key.toString() + key2.toString()}"]`).innerHTML;
        insightsAndNeeds[key].insights[key2] = val;
      });
      Object.entries(value.needs).map(([key2, value2]) => {
        let val = document.querySelector(`[Needs-id="${key.toString() + key2.toString()}"]`).innerHTML;
        insightsAndNeeds[key].needs[key2] = val;
      });
    });
  };

  return (
    <div className="container-activity-6">

      <div className='header-activity-6'>

        {/*activity six label*/}
        <h2 dangerouslySetInnerHTML={{ __html: ` ${label}` }} contentEditable="true" id="activity-six-label" className="editable-lable"></h2>
        <Button onClick={() => { window.location.reload(false); }} className="reset-button">
          Reset
        </Button>
      </div>
      <form onSubmit={handleSubmit}>

        {/*activity six instruction*/}
        <Typography id="activity-six-instruction" className="editable-instruction" dangerouslySetInnerHTML={{ __html: ` ${instruction}` }} contentEditable={instructor && true}></Typography>
        {blankTemplate && <Typography className="info-text">
          No transcript has been displayed since no data was entered in Activity 1.
        </Typography>}

        {!blankTemplate && (
          <div>

            <div className='clusters-header-container'>
              <Typography className='clusters-header'>
                Clusters
              </Typography>
              <Typography className='clusters-header'>
                Insights
              </Typography>
              <Typography className='clusters-header'>
                Needs
              </Typography>
            </div>

            {/*displays components*/}
            <DisplayComponents insightsAndNeeds={insightsAndNeeds} deleteInsight={deleteInsight} deleteNeeds={deleteNeeds} addInsight={addInsight} addNeed={addNeed} />

          </div>
        )}

        <Button fullWidth type="submit" variant="outlined" className="submit-button">Submit</Button>
      </form>
    </div>
  );
};

export default Act6;