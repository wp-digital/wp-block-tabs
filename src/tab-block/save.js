import { useBlockProps } from '@wordpress/block-editor';
import { InnerBlocks } from "@wordpress/block-editor";

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</div>
	);
}
