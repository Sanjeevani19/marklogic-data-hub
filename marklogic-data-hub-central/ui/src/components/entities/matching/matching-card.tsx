import React, { CSSProperties, useState } from 'react';
import styles from './matching-card.module.scss';
import {Card, Icon, Tooltip, Row, Col, Modal, PageHeader, Avatar} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt, faCircle} from '@fortawesome/free-regular-svg-icons';
import sourceFormatOptions from '../../../config/formats.config';
import {convertDateFromISO, getInitialChars, extractCollectionFromSrcQuery} from '../../../util/conversionFunctions';
import CreateEditMatchingDialog from './create-edit-matching-dialog/create-edit-matching-dialog';
import { MLTooltip, MLButton } from '@marklogic/design-system';
import ShowMoreText from 'react-show-more-text';
import MultiSlider from './multi-slider/multi-slider';


interface Props {
    data: any;
    entityName: any;
    deleteMatchingArtifact: any;
    createMatchingArtifact: any;
    canReadMatchMerge: any;
    canWriteMatchMerge: any;
  }

const MatchingCard: React.FC<Props> = (props) => {
    const [newMatching, setNewMatching] = useState(false);
    const [title, setTitle] = useState('');
    const [matchingData, setMatchingData] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [loadArtifactName, setLoadArtifactName] = useState('');

    const { Meta } = Card;

    const OpenAddNewDialog = () => {
        setTitle('New Matching');
        setNewMatching(true);
    }

    const OpenEditStepDialog = (index) => {
        setTitle('Edit Matching');
        setMatchingData(prevState => ({ ...prevState, ...props.data[index]}));
        setNewMatching(true);
    }

    const OpenMatchingSettingsDialog = (index) => {
        console.log('Open settings')
    }

    //Custom CSS for source Format
    const sourceFormatStyle = (sourceFmt) => {
        let customStyles: CSSProperties = {
            float: 'right',
            backgroundColor: (sourceFmt.toUpperCase() === 'XML' ? sourceFormatOptions.xml.color : (sourceFmt.toUpperCase() === 'JSON' ? sourceFormatOptions.json.color : (sourceFmt.toUpperCase() === 'CSV' ? sourceFormatOptions.csv.color : sourceFormatOptions.default.color))),
            fontSize: '12px',
            borderRadius: '50%',
            textAlign: 'left',
            color: '#ffffff',
            padding: '5px'
        }
        return customStyles;
    }


    const handleCardDelete = (name) => {
        setDialogVisible(true);
        setLoadArtifactName(name);
    }

    const onOk = (name) => {
        props.deleteMatchingArtifact(name)
        setDialogVisible(false);
    }

    const onCancel = () => {
        setDialogVisible(false);
    }

    // TODO get match options from backend
    const matchOptions = [
        {
            props: [{
                prop: 'First',
                type: 'Exact'
            }],
            value: 5
        },
        {
            props: [{
                prop: 'DOB',
                type: 'Exact'
            }],
            value: 22
        },
        {
            props: [{
                prop: 'Foo',
                type: 'Bar'
            }],
            value: 35
        },
        {
            props: [{
                prop: 'First',
                type: 'Exact'
            }],
            value: 20
        },
        {
            props: [{
                prop: 'DOB',
                type: 'Exact'
            }],
            value: 25
        },
        {
            props: [{
                prop: 'Foo',
                type: 'Bar'
            }],
            value: 30
        },
        {
            props: [{
                prop: 'First',
                type: 'Exact'
            }],
            value: 35
        },
        {
            props: [{
                prop: 'DOB',
                type: 'Exact'
            }],
            value: 40
        },
        {
            props: [{
                prop: 'Foo',
                type: 'Bar'
            }],
            value: 45
        },
        {
            props: [{
                prop: 'First',
                type: 'Exact'
            }],
            value: 50
        },
        {
            props: [{
                prop: 'DOB',
                type: 'Exact'
            }],
            value: 55
        },
        /*{
            props: [{
                prop: 'Foo',
                type: 'Bar'
            }],
            value: 60
        },
        {
            props: [{
                prop: 'First',
                type: 'Exact'
            }],
            value: 65
        },
        {
            props: [{
                prop: 'DOB',
                type: 'Exact'
            }],
            value: 70
        },
        {
            props: [{
                prop: 'Foo',
                type: 'Bar'
            }],
            value: 75
        },
        {
            props: [{
                prop: 'First',
                type: 'Exact'
            }],
            value: 80
        },
        {
            props: [{
                prop: 'DOB',
                type: 'Exact'
            }],
            value: 85
        },
        {
            props: [{
                prop: 'Foo',
                type: 'Bar'
            }],
            value: 90
        },*/
    ];

    const handleSlider = (values) => {
        // TODO put match options to backend
        console.log('handleSlider', values);
    }

    const deleteConfirmation = <Modal
        visible={dialogVisible}
        okText='Yes'
        cancelText='No'
        onOk={() => onOk(loadArtifactName)}
        onCancel={() => onCancel()}
        width={350}
        maskClosable={false}
        >
        <span style={{fontSize: '16px'}}>Are you sure you want to delete this?</span>
        </Modal>;

    return (
        <div className={styles.matchingContainer}>
            <Row gutter={16} type="flex" >
                {props.canWriteMatchMerge ? <Col >
                    <Card
                        size="small"
                        className={styles.addNewCard}>
                        <div><Icon type="plus-circle" className={styles.plusIcon} theme="filled" onClick={OpenAddNewDialog}/></div>
                        <br />
                        <p className={styles.addNewContent}>Add New</p>
                    </Card>
                </Col> : ''}{props && props.data.length > 0 ? props.data.map((elem,index) => (
                    <Col key={index}><Card
                        actions={[
                            <span></span>,
                            <MLTooltip title={'Settings'} placement="bottom"><Icon type="setting" key="setting" onClick={() => OpenMatchingSettingsDialog(index)}/></MLTooltip>,
                            <MLTooltip title={'Edit'} placement="bottom"><Icon type="edit" key="edit" onClick={() => OpenEditStepDialog(index)}/></MLTooltip>,
                            props.canWriteMatchMerge ? <MLTooltip title={'Delete'} placement="bottom"><i><FontAwesomeIcon icon={faTrashAlt} className={styles.deleteIcon} size="lg" onClick={() => handleCardDelete(elem.name)}/></i></MLTooltip> : <i><FontAwesomeIcon icon={faTrashAlt} onClick={(event) => event.preventDefault()} className={styles.disabledDeleteIcon} size="lg"/></i>,
                        ]}
                        className={styles.cardStyle}

                        size="small"
                    >
                        <div className={styles.formatFileContainer}>
                            <span className={styles.matchingNameStyle}>{getInitialChars(elem.name, 27, '...')}</span>
                             <span style={sourceFormatStyle(elem.sourceFormat)}>{elem.sourceFormat.toUpperCase()}</span>

                        </div><br />
                        {elem.selectedSource === 'collection' ? <div className={styles.sourceQuery}>Collection: {extractCollectionFromSrcQuery(elem.sourceQuery)}</div> : <div className={styles.sourceQuery}>Source Query: {getInitialChars(elem.sourceQuery,32,'...')}</div>}
                        <br /><br />
                        <p className={styles.lastUpdatedStyle}>Last Updated: {convertDateFromISO(elem.lastUpdated)}</p>
                    </Card></Col>
                )) : <span></span> }</Row>


            <PageHeader
                title={'Match Customer'}
                onBack={() => window.history.back()}
            >
                <Card bordered={false}><p className={styles.matchCardContent}>The Match step defines the criteria for determining whether the values from entities match, and
                    the action to take based on how close of a match they are</p>
                    <div>
                    <div className={styles.numberCircle}>1</div>
                    <Card title="Configure your thresholds" className={styles.matchCardTitle}  bordered={false} bodyStyle={{'backgroundColor': '#F4F4F4'}}>
                        <div className={styles.mainContent}>
                        <div className={styles.sliderContent} >
                            <ShowMoreText
                                /* Default options */
                                lines={1}
                                more='more'
                                less='less'
                                expanded={false}
                                width={1000}
                            >
                            A threshold specifies how closely entities have to match before a certain action is triggered.
                        The action could be the merging of those entities, the creation of a match notification,
                        or a custom action that is defined programmatically. Click the Add button to create a threshold.
                        If most of the values in the entities should match to trigger the action associated
                        with your threshold, then move the threshold higher on the scale.
                        If only some of the values in the entities must match, then move the threshold lower
                            </ShowMoreText>
                        </div>
                        <div className={styles.sliderButton}>
                         <MLButton
                             size="default"
                             type='primary'
                         >
                             Add
                         </MLButton>
                        </div>
                        </div>
                        <MultiSlider options={matchOptions} handleSlider={handleSlider}/>
                    </Card>
                    </div>
                    <Card title="Place rulesets on a match scale" bordered={false} bodyStyle={{'backgroundColor': '#F4F4F4'}}>
                        <div className={styles.mainContent}>
                        <div className={styles.sliderContent}>
                            <ShowMoreText
                                /* Default options */
                                lines={1}
                                more='more'
                                less='less'
                                expanded={false}
                                width={1000}
                                //style={{width:'100%'}}
                            >
                        A ruleset specifies the criteria for determining whether the values of your entities match. The
                        way you define your rulesets, and where you place them on the scale, influences
                        whether the entities are considered a match. Click the Add button to create a ruleset. If you
                        want the ruleset to have a major influence over whether entities are qualify as
                        a "match", move it higher on the scale. If you want it to have only some influence, then move
                        the ruleset lower.
                            </ShowMoreText>
                        </div>
                            <div className={styles.sliderButton}>
                                <MLButton
                                    size="default"
                                    type='primary'
                                >
                                    Add
                                </MLButton>
                            </div>
                        </div>
                        <MultiSlider options={matchOptions} handleSlider={handleSlider}/>
                    </Card>
                    <Card title="Possible Combinations of Matched Rulesets" bordered={false} bodyStyle={{'backgroundColor': '#e5e7f0'}}>
                        Add thresholds and rulesets to the above scales to see which combinations of qualifying rulesets
                        would meet each threshold.
                    </Card>
                </Card>
            </PageHeader>




                <CreateEditMatchingDialog
                newMatching={newMatching}
                title={title}
                setNewMatching={setNewMatching}
                targetEntityType={props.entityName}
                createMatchingArtifact={props.createMatchingArtifact}
                deleteMatchingArtifact={props.deleteMatchingArtifact}
                matchingData={matchingData}
                canReadWrite={props.canWriteMatchMerge}
                canReadOnly={props.canReadMatchMerge}/>
                {deleteConfirmation}

        </div>
    );

}

export default MatchingCard;
