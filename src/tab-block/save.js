import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from "@wordpress/block-editor";

export default function save( props ) {
	const { attributes } = props;
	let { index, parentBlockId, isActive } = attributes;

	if( ! index ) {
		index = 0;
	}

	return (
		<div className={ isActive ? 'active' : '' } id={`tab-${parentBlockId}-${index}`}>
			<InnerBlocks.Content />
		</div>
	);
}
