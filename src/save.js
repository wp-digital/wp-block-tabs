import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from "@wordpress/block-editor";
import { RichText } from "@wordpress/block-editor";

export default function save( props ) {
	const { attributes } = props;
	const {
		tabsHeadings,
		activeTab
	} = attributes;

	return (
		<div { ...useBlockProps.save() }>
			<div className="tabs-headings">
				{ tabsHeadings.map( ( heading, index ) => (
					<div className={ "tab-heading" + ( activeTab === index ? " active" : "") } key={ index }>
						{ heading }
					</div>
				) ) }
			</div>
			<div className="tabs-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
