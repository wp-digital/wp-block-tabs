import { InnerBlocks } from "@wordpress/block-editor";
import { select, withSelect } from '@wordpress/data';
import { applyFilters } from "@wordpress/hooks";

const ALLOWED_BLOCKS = applyFilters(
	'innocode.block-tab.allowed-blocks',
	[
		'core/paragraph',
		'core/heading',
		'core/separator',
		'core/spacer'
	]
);

export default withSelect( ( select, props ) => ( {
	blockParentId: select( 'core/block-editor' ).getBlockRootClientId( props.clientId) ,
} ) )( props => {
	const { blockParentId, setAttributes, attributes } = props;
	const { parentBlockId, isActive } = attributes;

	if ( parentBlockId === "" || parentBlockId !== blockParentId ) {
		setAttributes( { parentBlockId: blockParentId } );
	}

	return (
		<div style={{ display: isActive ? "block" : "none" }}>
			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
			/>
		</div>
	);
});
