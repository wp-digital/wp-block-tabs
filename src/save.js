import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from "@wordpress/block-editor";
import { RichText } from "@wordpress/block-editor";

export default function save( props ) {
	const { attributes } = props;
	const {
		blockID,
		tabsHeadings,
		activeTab,
		isVertical
	} = attributes;

	return (
		<div
			className={`tabs-wrapper${
				isVertical ? " vertical-tabs" : ""
			}`}
		>
			<div className={`tabs-headings${
				isVertical ? " vertical-headings" : ""
			}`}>
				<div className="tabs-headings-container">
					{ tabsHeadings.map( ( heading, index ) => (
						<a href={`tab-${blockID}-${index}`} className={ "tab-heading" + ( activeTab === index ? " active" : "") } key={ index }>
							{ heading }
						</a>
					) ) }
				</div>
			</div>
			<div className={`tabs-content${
				isVertical ? " vertical-content" : ""
			}`}>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
