# Turns dist-single/index.html into dist-single/artifact.html: the same page without the
# <html>/<head>/<body> wrapper, which the Artifact host supplies itself.
import re
src = open('dist-single/index.html', encoding='utf-8').read()
head = re.search(r'<head>(.*?)</head>', src, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', src, re.S).group(1)
pat = r'<title>.*?</title>|<meta name="theme-color"[^>]*>|<link[^>]*fonts\.g[^>]*>|<style[^>]*>.*?</style>|<script[^>]*>.*?</script>'
keep = [m.group(0) for m in re.finditer(pat, head, re.S)]
scripts = [k for k in keep if k.startswith('<script')]
rest = [k for k in keep if not k.startswith('<script')]
out = '\n'.join(rest) + '\n' + body.strip() + '\n' + '\n'.join(scripts) + '\n'
open('dist-single/artifact.html', 'w', encoding='utf-8').write(out)
print('fragment bytes:', len(out.encode()), '| styles:', sum(k.startswith('<style') for k in keep), '| scripts:', len(scripts))
