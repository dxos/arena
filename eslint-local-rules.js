const REGEX = /Copyright/;
const TEMPLATE = [
  '//',
  `// Copyright ${new Date().getFullYear()} DXOS.org`,
  '//',
  '',
].join('\n') + '\n'

module.exports = {
  'header': {
    meta: {
      type: 'layout',

      docs: {
        description: 'enforce copyright header',
      },
      fixable: 'code',
      schema: [],
    },
    create: context => {
      return {
        Program: (node) => {
          if(!context.getSource().match(REGEX)) {
            context.report({
              node,
              message: 'Missing copyright header',
              fix: fixer => fixer.insertTextBefore(node, TEMPLATE),
            });
          }
        }
      };
    }
  }
}