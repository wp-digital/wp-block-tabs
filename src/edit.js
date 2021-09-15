/**
 * External dependencies
 */
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove,
} from "react-sortable-hoc";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';;
import { Component } from '@wordpress/element';
import {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { withState, compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

import './editor.scss';

class Tabs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: -1,
		};
	}

	render() {
		const {
			setAttributes,
			attributes,
			isSelected,
			moveBlockToPosition,
			order,
			setState,
			updateBlockAttributes,
			removeBlock,
			selectedBlock,
			selectBlock,
			insertBlock,
			getBlock,
			getClientIdsWithDescendants,
		} = this.props;
		const {
			blockID,
			activeTab,
			tabsHeadings,
			isVertical
		} = attributes;

		window.innocodeTabsBlocks = window.innocodeTabsBlocks || [];

		let block = null;

		for( const tabsBlock of window.innocodeTabsBlocks ) {
			if ( tabsBlock.id === attributes.id ) {
				block = tabsBlock;
				break;
			}
		}

		if ( ! block ) {
			block = {
				id: this.props.block.clientId,
				SortableItem: null,
				SortableList: null,
			};
			window.innocodeTabsBlocks.push( block );
			setAttributes( { id: block.id } );
		}

		if ( ! tabsHeadings ) {
			tabsHeadings = [];
		}

		const tabs = this.props.block.innerBlocks;

		const showControls = ( type, index ) => {
			setAttributes( {
				activeControl: `${type}-${index}`,
				activeTab: index,
			} );

			tabs.forEach( ( tab, i ) => {
				updateBlockAttributes( tab.clientId, { isActive: index === i } );
			} );
		};

		const addTab = ( index ) => {
			insertBlock(
				createBlock("innocode/wp-block-tab", {}),
				index,
				this.props.block.clientId
			);
			setAttributes({
				tabsHeadings: [ ...tabsHeadings, __( 'Tab heading', 'wp-block-tabs' ) ],
				activeTab: index,
			});
			showControls( 'tab-title', index );
		};

		if ( attributes.tabsHeadings.length === 0 ) {
			addTab( 0 );
		}

		const DragHandle = SortableHandle( () => (
			<span className="dashicons dashicons-move drag-handle" />
		) );

		if ( ! block.SortableItem ) {
			block.SortableItem = SortableElement(
				( { value, i, properties, onChangeTitle, onRemoveTitle, toggleTitle } ) => (
					<div
						className={`tab-title-${
							properties.attributes.isVertical ? "vertical-" : ""
						}wrap SortableItem${
							properties.attributes.activeTab === i ? " active" : ""
						}`}
						onClick={ () => toggleTitle( 'tab-title', i ) }
					>
						<RichText
							tagName="div"
							className="tab-title"
							value={ value }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
							isSelected={
								properties.attributes.activeControl === `tab-title-${i}` &&
								properties.isSelected
							}
							onChange={ ( content ) => onChangeTitle( content, i ) }
							placeholder={ __( 'Tab Heading', 'wp-block-tabs')}
						/>
						<div
							className={`tab-actions${
								properties.attributes.tabsHeadings.length === 1 ? " hide" : ""
							}`}
						>
							<DragHandle />
							<span
								className="dashicons dashicons-minus remove-tab-icon"
								onClick={ () => onRemoveTitle( i ) }
							/>
						</div>
					</div>
				)
			);
		}

		if ( ! block.SortableList ) {
			block.SortableList = SortableContainer(
				( {
					 items,
					 properties,
					 onChangeTitle,
					 onRemoveTitle,
					 toggleTitle,
					 onAddTab,
				 } ) => (
					<div
						className={`tabs-title${
							properties.attributes.isVertical ? "-vertical" : ""
						} SortableList`}
						useWindowAsScrollContainer={ true }
					>
						{ items.map( ( value, index ) => (
							<block.SortableItem
								properties={ properties }
								key={ `item-${index}` }
								i={ index }
								index={ index }
								value={ value }
								onChangeTitle={ onChangeTitle }
								onRemoveTitle={ onRemoveTitle }
								toggleTitle={ toggleTitle }
							/>
						) ) }
						<div
							className={`tab-title-${
								properties.attributes.isVertical ? "vertical-" : ""
							}wrap`}
							key={ properties.attributes.tabsHeadings.length }
							onClick={ () => onAddTab( properties.attributes.tabsHeadings.length ) }
						>
							<span className="dashicons dashicons-plus-alt" />
						</div>
					</div>
				)
			);
		}

		const updatedOrder = tabs.map( ( tab ) => tab.attributes.index );

		if ( ! updatedOrder.every( ( i, j ) => i === order[ j ] ) ) {
			tabs.forEach( ( tab, i ) =>
				updateBlockAttributes( tab.clientId, {
					index: i,
					isActive: attributes.activeTab === i,
				} )
			);
			setState( { order: updatedOrder } );
		}

		if ( selectedBlock && selectedBlock.clientId !== this.props.block.clientId ) {
			if (
				tabs.filter( ( innerblock ) => innerblock.attributes.isActive ).length === 0
			) {
				showControls( 'tab-title', tabs.length - 1 );
			}
			if (
				tabs.filter( ( tab ) => tab.clientId === selectedBlock.clientId ).length >
				0 &&
				! selectedBlock.attributes.isActive
			) {
				selectBlock( this.props.block.clientId );
			}
		}

		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				( ID ) =>
					"blockID" in getBlock( ID ).attributes &&
					getBlock( ID ).attributes.blockID === attributes.blockID
			)
		) {
			setAttributes( { blockID: this.props.block.clientId } );
		}

		return [
			<InspectorControls>
				<PanelBody title={ __('Tabs Layout', 'wp-block-tabs') }>
					<ToggleControl
						label= { __('Vertical', 'wp-block-tabs' ) }
						checked={ isVertical }
						onChange={ ( isVertical ) => setAttributes( { isVertical } ) }
					/>
				</PanelBody>
			</InspectorControls>,
			<div
				className={`tabs-wrapper${
					isVertical ? " vertical-tabs" : ""
				}`}
			>
				<div
					className={`tabs-headings${
						isVertical ? " vertical-headings" : ""
					}`}
				>
					<div className="tabs-headings-container">
						<block.SortableList
							axis={ isVertical ? "y" : "x" }
							properties={ this.props }
							items={ attributes.tabsHeadings }
							onSortEnd={ ( { oldIndex, newIndex } ) => {
								const titleItems = attributes.tabsHeadings.slice( 0 );
								setAttributes( {
									tabsHeadings: arrayMove( titleItems, oldIndex, newIndex ),
									activeTab: newIndex,
								} );

								moveBlockToPosition(
									tabs.filter( ( tab ) => tab.attributes.index === oldIndex )[ 0 ]
										.clientId,
									this.props.block.clientId,
									this.props.block.clientId,
									newIndex
								);

								setAttributes({
									activeControl: `tab-title-${newIndex}`,
									activeTab: newIndex,
								});

								tabs.forEach((tab, i) => {
									updateBlockAttributes(tab.clientId, {
										isActive: oldIndex === i,
									});
								});
							}}
							onRemoveTitle={ ( i ) => {
								setAttributes( {
									tabsHeadings: [
										...tabsHeadings.slice( 0, i ),
										...tabsHeadings.slice( i + 1 ),
									],
									activeTab: 0,
								});
								removeBlock(
									tabs.filter( ( tab ) => tab.attributes.index === i )[ 0 ].clientId
								);
								showControls( 'tab-title', 0 );
							}}
							onAddTab={ addTab }
							toggleTitle={ showControls }
							useDragHandle={ true }
							onChangeTitle={ ( content, i ) => {
								setAttributes({
									tabsHeadings: [
										...attributes.tabsHeadings.slice( 0, i ),
										content,
										...attributes.tabsHeadings.slice( i + 1 ),
									],
								} );
							} }
						/>
					</div>
				</div>
				<div
					className={`tabs-content${
						isVertical ? " vertical-content" : ""
					}`}
				>
					<InnerBlocks
						templateLock={ false }
						allowedBlocks={ [ 'innocode/wp-block-tab' ] }
						template={ [ [ 'innocode/wp-block-tab' ] ] }
					/>
				</div>
			</div>
		];
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getBlock, getSelectedBlock, getClientIdsWithDescendants } = select( 'core/block-editor' );

		return {
			block: getBlock( props.clientId ),
			selectedBlock: getSelectedBlock(),
			getBlock,
			getClientIdsWithDescendants,
		};
	}),
	withDispatch(( dispatch ) => {
		const {
			updateBlockAttributes,
			insertBlock,
			removeBlock,
			moveBlockToPosition,
			selectBlock,
		} = dispatch( 'core/block-editor' );

		return {
			updateBlockAttributes,
			insertBlock,
			removeBlock,
			moveBlockToPosition,
			selectBlock,
		};
	}),
	withState({ order: [] }),
] )( props =>
	<div className={'wp-block-innocode-wp-block-tabs'}>
		<Tabs { ...props }/>
	</div>
);
