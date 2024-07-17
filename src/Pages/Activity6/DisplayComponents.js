import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import './Activity6.css'

const DisplayComponents = ({ insightsAndNeeds, deleteInsight, deleteNeeds, addInsight, addNeed }) => {

    //gets list of content for each cluster
    const getContent = (data) => {
        return Object.entries(data.content).map(([key, value]) => {
            if (value.type !== "label") {
                return (
                    <div className='cluster-accordian-content'>
                        {value.text}
                    </div>
                );
            }
        });
    };

    //gets list of insights for each cluster
    const getInsight = (data, baseKey) => {
        return Object.entries(data.insights).map(([key, value]) => {
            return (
                <div className='cluster-accordian-insight'>
                    <Typography
                        onBlur={() => {
                            let element = document.querySelector(`[Insight-id="${baseKey.toString() + key.toString()}"]`);
                            element.innerHTML === "" || element.innerHTML === `<br>`
                                ? deleteInsight(baseKey, key)
                                : console.log(element.innerHTML);
                        }}
                        Insight-id={baseKey.toString() + key.toString()}
                        contenteditable="true"
                        className='cluster-accordian-insight-text'
                    >
                        {value}
                    </Typography>
                </div>
            );
        });
    };

    //gets list of needs for each cluster
    const getNeed = (data, baseKey) => {
        return Object.entries(data.needs).map(([key, value]) => {
            return (
                <div className='cluster-accordian-need'>
                    <Typography
                        onBlur={() => {
                            let element = document.querySelector(`[Needs-id="${baseKey.toString() + key.toString()}"]`);
                            element.innerHTML === "" || element.innerHTML === `<br>`
                                ? deleteNeeds(baseKey, key)
                                : console.log(element.innerHTML);
                        }}
                        Needs-id={baseKey.toString() + key.toString()}
                        contenteditable="true"
                        className='cluster-accordian-need-text'
                    >
                        {value}
                    </Typography>
                </div>
            );
        });
    };

    return (
        Object.entries(insightsAndNeeds).map(([key, value]) => {
            return (
                <div key={key} className='cluster-details-container'>

                    {/*displays selected components for each label*/}
                    <div style={{ width: "100%" }}>
                        <Accordion className='cluster-accordian'>
                            <AccordionSummary className='cluster-accordian-header' expandIcon={<ExpandMoreIcon />}>
                                <Typography className='cluster-accordian-label'>
                                    {value.label.text}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>{getContent(value)}</AccordionDetails>
                        </Accordion>
                    </div>

                    {/*displays insights*/}
                    <div style={{ width: "100%" }}>
                        {getInsight(value, key)}
                        <Button variant="outlined" onClick={() => addInsight(key)} className='cluster-button'>
                            +
                        </Button>
                    </div>

                    {/*displays needs*/}
                    <div style={{ width: "100%" }}>
                        {getNeed(value, key)}
                        <Button variant="outlined" onClick={() => addNeed(key)} className='cluster-button'>
                            +
                        </Button>
                    </div>

                </div>
            );
        })
    )
}

export default DisplayComponents;