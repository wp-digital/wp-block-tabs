import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import attributes from './attributes';
import Edit from './edit';
import save from './save';

import tabAttributes from './tab-block/attributes';
import tabEdit from './tab-block/edit';
import tabSave from './tab-block/save';

import './style.scss';

registerBlockType('innocode/wp-block-tab', {
	title: __( 'Tab', 'wp-block-tabs' ),
	parent: [ 'innocode/wp-block-tabs' ],
	description: __( 'Tab content block', 'wp-block-tabs' ),
	category: 'innocode',
	attributes: tabAttributes,
	edit: tabEdit,
	save: tabSave
});

registerBlockType( 'innocode/wp-block-tabs', {
	attributes,
	edit: Edit,
	save,
} );
