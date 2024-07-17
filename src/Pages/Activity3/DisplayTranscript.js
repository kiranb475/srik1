import { Typography, Box } from '@mui/material';
import './Activity3.css'

const DisplayTranscript = ({ activityMVCContent, highlightingNotAllowed }) => {

    //displays interviewee text
    const displayInterviewee = (data, key) => {
        return Object.entries(data).map(([key2, value]) => (
            <Typography
                sx={{ display: 'inline' }}
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: value.html }}
            ></Typography>
        ));
    };

    // handles highlighting
    const handleClick = (event) => {
        console.log(highlightingNotAllowed)
        if (highlightingNotAllowed === "false") {
            //checks if background color is green
            if (event.target.style.backgroundColor === "rgb(23, 177, 105)") {
                //changes it to blue
                event.target.style.backgroundColor = "rgb(108, 180, 238)";
            //checks if background color is blue
            } else if (event.target.style.backgroundColor === "rgb(108, 180, 238)") {
                //changes it to green 
                event.target.style.backgroundColor = "rgb(23, 177, 105)";
            //no background color
            } else if (event.target.style.backgroundColor === "") {
                //background color changed to yellow
                event.target.style.backgroundColor = "rgb(255, 199, 44)";
                event.target.style.borderRadius = "4px";
                event.target.style.padding = "2px";
            //changes it to no background color since it was initially yellow
            } else {
                event.target.style.backgroundColor = "";
                event.target.style.borderRadius = "";
                event.target.style.padding = "";
            }
        }
    };
    return (
        <Box id="content-container" className="content-container">
            {Object.entries(activityMVCContent).map(([key, value]) => {
                //interviewer text
                if (key % 2 !== 0) {
                    value.activity_mvc.html = value.activity_mvc.html.replace('<p', '<span').replace('</p>', '</span>');
                    return (
                        <div style={{ marginBottom: "20px" }}>
                            <Typography
                                sx={{ display: 'inline-block' }}
                                dangerouslySetInnerHTML={{ __html: `${value.tag}: ${value.activity_mvc.html}` }}
                            ></Typography>
                        </div>
                    );
                //interviewee text
                } else {
                    return (
                        <div style={{ marginBottom: "20px" }}>
                            <Typography sx={{ display: 'inline' }}>
                                <strong>{value.tag}</strong>:{" "}
                            </Typography>
                            {displayInterviewee(value.activity_mvc, key)}
                        </div>
                    );
                }
            })}
        </Box>
    );
}

export default DisplayTranscript;