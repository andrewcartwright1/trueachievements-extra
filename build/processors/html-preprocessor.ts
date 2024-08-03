import { extname } from 'path';
import { minify } from '@minify-html/node';
import Handlebars from '../handlebars';
import { LoaderContext } from '@rspack/core';

const minifyOpts = {
  do_not_minify_doctype: false,
  ensure_spec_compliant_unquoted_attribute_values: true,
  keep_closing_tags: true,
  keep_html_and_head_opening_tags: false,
  keep_spaces_between_attributes: false,
  keep_comments: false,
  minify_css: true,
  minify_js: true,
  remove_bangs: true,
  remove_processing_instructions: true
};

export default function (content: string, loaderContext: LoaderContext<unknown>) {
  try {
    let result = content;
  
    if (extname(loaderContext.resourcePath) === '.hbs') {
      result = Handlebars.compile(content)({});
    }

    return minify(Buffer.from(result), minifyOpts).toString();
  } catch (error) {
    loaderContext.emitError(error);

    return content;
  }
}
