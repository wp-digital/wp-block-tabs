import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from "@wordpress/block-editor";

export default function save( props ) {
	const { attributes } = props;
	let { index } = attributes;

	if( ! index ) {
		index = 0;
	}

	return (
		<div { ...useBlockProps.save( {
			id: `#tab-${index}`
		} ) }>
			<InnerBlocks.Content />
		</div>
	);
}
