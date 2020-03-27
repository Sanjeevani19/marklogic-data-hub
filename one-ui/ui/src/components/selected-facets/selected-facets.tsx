import React, {useContext, useEffect} from 'react';
import {Icon} from 'antd';
import {MlButton} from 'marklogic-ui-library';
import {SearchContext} from '../../util/search-context';
import styles from './selected-facets.module.scss';
import moment from 'moment';
import {stringConverter} from "../../util/string-conversion";


interface Props {
    selectedFacets: any[];
    greyFacets: any[];
};


const SelectedFacets: React.FC<Props> = (props) => {
    const {
        clearAllFacets,
        clearAllGreyFacets,
        clearFacet,
        clearGreyFacet,
        searchOptions,
        greyedOptions,
        clearDateFacet,
        clearRangeFacet,
        setAllSearchFacets,
    } = useContext(SearchContext);


    const applyFacet = () => {
        //console.log("DEBUG - DOING AN APPLY ")
        setAllSearchFacets(greyedOptions.searchFacets);
        clearAllGreyFacets();

    }


    const unCheckRest = (constraint, facet) => {
        // console.log("debug - selected facets, item.facet", facet, "item.constraint", constraint, "checkedoptions", props.checkedFacets, "searchOptions", props.selectedFacets);
        if (props.selectedFacets.length == 0)
            return true;
        for (let item of props.selectedFacets) {
            if (item.constraint === constraint && item.facet === facet)
                return false;
        }
        return true;
    }


    return (
        <div
            id='selected-facets'
            data-testid='selected-facet-block'
            data-cy='selected-facet-block'
            className={styles.clearContainer}
            style={(Object.entries(searchOptions.searchFacets).length === 0 && Object.entries(greyedOptions.searchFacets).length === 0) ? {'visibility': 'hidden'} : {'visibility': 'visible'}}
        >
            {(props.selectedFacets.length > 0 || props.greyFacets.length > 0) &&
            <MlButton
                size="small"
                className={styles.clearAllBtn}
                onClick={() => clearAllFacets()}
                data-cy='clear-all-button'
                data-testid='clear-all-button'
            >
                <Icon type='close'/>
                Clear All
            </MlButton>
            }

            {props.selectedFacets.map((item, index) => {
                if (item.constraint === 'createdOnRange') {
                    let dateValues: any = [];
                    dateValues.push(item.facet.lowerBound, item.facet.upperBound);
                    return (
                        <MlButton
                            size="small"
                            className={styles.dateFacet}
                            key={index}
                            onClick={() => clearDateFacet()}
                            data-cy='clear-date-facet'
                            data-testid='clear-date-facet'
                        >
                            <Icon type='close'/>
                            {dateValues.join(' ~ ')}
                        </MlButton>
                    )
                } else if (item.rangeValues) {
                    if (moment(item.rangeValues.lowerBound).isValid() && moment(item.rangeValues.upperBound).isValid()) {
                        let dateValues: any = [];
                        dateValues.push(item.rangeValues.lowerBound, item.rangeValues.upperBound);
                        return (
                            <MlButton
                                size="small"
                                className={styles.dateFacet}
                                key={index}
                                onClick={() => clearRangeFacet(item.constraint)}
                            >
                                <Icon type='close'/>
                                {item.constraint + ': ' + item.rangeValues.lowerBound + ' ~ ' + item.rangeValues.upperBound}
                            </MlButton>
                        )
                    } else {
                        return (
                            <MlButton
                                size="small"
                                className={styles.facetButton}
                                key={index}
                                onClick={() => clearRangeFacet(item.constraint)}
                                data-cy='clear-range-facet'
                                data-testid='clear-range-facet'
                            >
                                <Icon type='close'/>
                                {item.constraint + ': ' + item.rangeValues.lowerBound + ' - ' + item.rangeValues.upperBound}
                            </MlButton>
                        )
                    }
                }
                return (
                    <MlButton
                        size="small"
                        className={styles.facetButton}
                        key={index}
                        onClick={() => clearFacet(item.constraint, item.facet)}
                        data-cy={`clear-${item.facet}`}
                        data-testid={`clear-${item.facet}`}
                    >
                        <Icon type='close'/>
                        {item.constraint + ': ' + item.facet}
                    </MlButton>
                )
            })}

            {props.greyFacets.map((item, index) => {
                if (item.constraint === 'createdOnRange') {
                    let dateValues: any = [];
                    dateValues.push(item.facet.lowerBound, item.facet.upperBound);
                    return (
                        <MlButton
                            size="small"
                            className={styles.facetGreyButton}
                            key={index}
                            onClick={() => clearDateFacet()}
                            data-cy='clear-date-facet'
                            data-testid='clear-date-facet'
                        >
                            <Icon type='close'/>
                            {dateValues.join(' ~ ')}
                        </MlButton>
                    )
                } else if (item.rangeValues) {
                    if (moment(item.rangeValues.lowerBound).isValid() && moment(item.rangeValues.upperBound).isValid()) {
                        let dateValues: any = [];
                        dateValues.push(item.rangeValues.lowerBound, item.rangeValues.upperBound);
                        return (
                            <MlButton
                                size="small"
                                className={styles.facetGreyButton}
                                key={index}
                                onClick={() => clearRangeFacet(item.constraint)}
                            >
                                <Icon type='close'/>
                                {item.constraint + ': ' + item.rangeValues.lowerBound + ' ~ ' + item.rangeValues.upperBound}
                            </MlButton>
                        )
                    } else {
                        return (
                            <MlButton
                                size="small"
                                className={styles.facetGreyButton}
                                key={index}
                                onClick={() => clearRangeFacet(item.constraint)}
                                data-cy='clear-range-facet'
                                data-testid='clear-range-facet'
                            >
                                <Icon type='close'/>
                                {item.constraint + ': ' + item.rangeValues.lowerBound + ' - ' + item.rangeValues.upperBound}
                            </MlButton>
                        )
                    }
                }
                return (
                    (unCheckRest(item.constraint, item.facet)) && <MlButton
                        size="small"
                        className={styles.facetGreyButton}
                        key={index}
                        onClick={() => clearGreyFacet(item.constraint, item.facet)}
                        data-cy={`clear-${item.facet}`}
                        data-testid={`clear-${item.facet}`}
                    >
                        <Icon type='close'/>
                        {item.constraint + ': ' + item.facet}
                    </MlButton>
                )
            })}
            {props.greyFacets.length > 0 &&
            <MlButton
                size="small"
                className={styles.clearAllBtn}
                onClick={() => clearAllGreyFacets()}
                data-cy='clear-all-button'
                data-testid='clear-all-button'
            >
                <Icon type='close'/>
            </MlButton>
            }
            {props.greyFacets.length > 0 &&
            <MlButton
                size="small"
                onClick={() => applyFacet()}
            >
                <Icon type='check'/>
            </MlButton>
            }

        </div>
    );
}

export default SelectedFacets;
