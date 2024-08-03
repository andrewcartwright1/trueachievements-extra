import minifyHtml from '@minify-html/node';
import { compileString } from 'sass';
import Handlebars from '../../build/handlebars';

export default () => {
  const hbsRegex = /\.hbs$/;
  const htmlRegex = /\.html$/;
  const scssRegex = /\.scss$/;

  const compileSass = (src: string): string => {
    const result = compileString(src);
    return result.css;
  };

  const compileHandlebars = (src: string): string => {
    const result = Handlebars.compile(src)({});
    return result;
  };

  const minifyContent = (src: string): string => {
    const minifyHtmlConfig = {
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

    const result = minifyHtml.minify(Buffer.from(src), minifyHtmlConfig).toString();
    return result;
  };

  return {
    name: 'vitest-web',

    transform(code: string, id: string) {
      let result: string = null;

      if (hbsRegex.test(id)) {
        const content = compileHandlebars(code);
        result = minifyContent(content);
      } else if (htmlRegex.test(id)) {
        result = minifyContent(code);
      } else if (scssRegex.test(id)) {
        result = compileSass(code);
      }

      if (result !== null) {
        return {
          code: 'module.exports = ' + JSON.stringify(result) + ';'
        };
      }
    }
  };
};
