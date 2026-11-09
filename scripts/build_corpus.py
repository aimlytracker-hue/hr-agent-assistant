import json, os
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from xml.sax.saxutils import escape
policies=json.load(open('docs/policies.json',encoding='utf-8'))
os.makedirs('deliverables',exist_ok=True)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='Rule',fontName='Helvetica-Bold',fontSize=11,leading=17,spaceAfter=16,textColor=HexColor('#211F3D')))
styles.add(ParagraphStyle(name='BodyHR',fontName='Helvetica',fontSize=10.5,leading=16,spaceAfter=10,textColor=HexColor('#303448')))
styles.add(ParagraphStyle(name='HeadingHR',fontName='Helvetica-Bold',fontSize=12,leading=17,spaceBefore=12,spaceAfter=6,textColor=HexColor('#211F3D')))
styles.add(ParagraphStyle(name='TitleHR',fontName='Helvetica-Bold',fontSize=26,leading=31,spaceAfter=14,textColor=HexColor('#211F3D')))
def footer(c,d):
 c.setStrokeColor(HexColor('#D9E3E7'));c.line(48,45,A4[0]-48,45);c.setFont('Helvetica',8);c.setFillColor(HexColor('#586B76'));c.drawString(48,31,'Synthetic HR policy corpus | Demonstration only | Version 1.0');c.drawRightString(A4[0]-48,31,str(d.page))
story=[]
for i,p in enumerate(policies):
 story.append(Paragraph(escape(p['category'].upper()+'   '+p['id']),styles['HeadingHR']))
 story.append(Paragraph(escape(p['title']),styles['TitleHR']))
 story.append(Paragraph('Effective 1 November 2026. Fictional policy for project demonstration. This is not Bank Rakyat policy.',styles['BodyHR']))
 story.append(Spacer(1,12))
 chunks=p['text'].split('\n\n')
 story.append(Paragraph(escape(chunks[0]),styles['Rule']))
 for block in chunks[1:]:
  h,b=block.split('\n',1);story.append(Paragraph(escape(h),styles['HeadingHR']));story.append(Paragraph(escape(b),styles['BodyHR']))
 if i<len(policies)-1:story.append(PageBreak())
SimpleDocTemplate('deliverables/Synthetic_HR_Policy_Corpus.pdf',pagesize=A4,rightMargin=48,leftMargin=48,topMargin=42,bottomMargin=58).build(story,onFirstPage=footer,onLaterPages=footer)
from pypdf import PdfReader
pdf=PdfReader('deliverables/Synthetic_HR_Policy_Corpus.pdf');assert len(pdf.pages)==30,len(pdf.pages)
print('Created and structurally verified 30 policy pages')
