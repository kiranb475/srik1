import { Typography } from '@mui/material';
import { useState, useEffect } from 'react'

function TranscriptPreview({ interviewer, interviewee, transcript, onPreviewGenerated }) {

    const [previewData, setPreviewData] = useState('');

    useEffect(() => {
        const cleaning = (text) => {
            //tabs are replaced by single space
            text = text.replace(/\s{4}/g, "");
            //multiple spaces are replaced by single space
            text = text.replace(/\s\s+/g, "");
            //multiple fullstops are replaced by a single fullstop
            text = text.replace(/\.+/g, ".");
            //?. is replaced by ?
            text = text.replace(/\?\./g, "?");
            //. . is replaced by .
            text = text.replace(/\. \./g, ". ");
            return text;
        };

        let data = {};
        if (transcript !== "") {

            //split the transcript into sentences based on punctuation marks (., !, ?, ;) or new lines
            let lines = cleaning(transcript).split(/\s*(?<=[.!?;])\s*|\n+/g);

            //matches any string starting with one or more characters followed by a colon
            const check1 = new RegExp(`^.+:`);

            let isQuestion = false;
            let sentence_num = 1;
            let question_num = 1;
            let answer_num = 1;
            let incorrectData = false;

            function splitFirstOccurrence(str, separator) {
                const index = str.indexOf(separator);
                //ensures function always returns two elements
                if (index === -1) return [str, '']; 
                return [str.slice(0, index).trim(), str.slice(index + separator.length).trim()];
            }

            //checks whether correct interview and interviewee labels have been used
            lines.forEach(line => {
                if (!(line.match(check1) && line.trim().startsWith(interviewer + ":")) && !(line.match(check1) && line.trim().startsWith(interviewee + ":")) && !(!line.match(check1))) {
                    onPreviewGenerated({ error: "Include the correct interviewer and interviewee labels." });
                    setPreviewData({})
                    incorrectData = true
                }
            })

            if (!incorrectData) {
                lines.forEach(line => {
                    if (line.match(check1) && line.trim().startsWith(interviewer + ":")) {

                        //handles interview questions
                        isQuestion = true;
                        question_num++;
                        data[sentence_num] = {
                            sentence_num: sentence_num,
                            question_id: question_num,
                            questioner_tag: interviewer,
                            question_text: splitFirstOccurrence(line, ":")[1],
                        };
                        sentence_num++;
                        answer_num = 1;

                    } else if (line.match(check1) && line.trim().startsWith(interviewee + ":")) {

                        //handles interviewer answer
                        isQuestion = false;
                        if (!data[sentence_num] || !data[sentence_num].response_text) {
                            data[sentence_num] = {
                                sentence_num: sentence_num,
                                response_id: question_num,
                                response_tag: interviewee,
                                response_text: {},
                            };
                        }
                        data[sentence_num].response_text[answer_num] = {
                            text: splitFirstOccurrence(line, ":")[1],
                        };
                        sentence_num++;
                        answer_num++;

                    } else if (!line.match(check1)) {

                        //handle continuation of interviewer questions and interviewee answers
                        if (isQuestion) {
                            data[sentence_num - 1].question_text += " " + cleaning(line);
                        } else {
                            data[sentence_num - 1].response_text[answer_num] = { text: cleaning(line) };
                            answer_num++
                        }
                    }

                });

                setPreviewData(data)
                onPreviewGenerated({ data: data });
            }
        }


    }, [interviewer, interviewee, transcript]);

    // display interviewee text
    const displayIntervieweeText = (value, name, key_ori) => {
        {
            return Object.entries(value).map(([key, value]) => {
                return (
                    <Typography id={key_ori + key} style={{ display: "inline" }}>{value.text}{" "}</Typography>
                );
            });
        }
    };

    //no transcript data has been provided
    if (Object.keys(previewData).length === 0) {
        return (
            <>
                <Typography align="center">No valid transcript data has been entered yet.</Typography>
            </>
        );
    } else {
        return Object.entries(previewData).map(([key, value]) => {
            if (value.questioner_tag !== undefined) {
                //interviewer text
                return (
                    <div key={key}>
                        <Typography display="inline">{value.questioner_tag}: </Typography>
                        <Typography display="inline" id={key}>
                            {value.question_text}
                        </Typography>
                        <br />
                        <br />
                    </div>
                );
            } else {
                //interviewee text
                return (
                    <>
                        <div key={key}>
                            <Typography display="inline">{value.response_tag}: </Typography>
                            {displayIntervieweeText(value.response_text, value.response_tag, key.toString())}
                        </div>
                        <div>
                            <br />
                        </div>
                    </>
                );
            }
        });
    }

}

export default TranscriptPreview;